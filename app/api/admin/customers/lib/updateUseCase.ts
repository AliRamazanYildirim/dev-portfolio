/**
 * Customer Update Use-Case – Eigenständiger Service für Kunden-Aktualisierung.
 *
 * SRP-Fix: Trennung von:
 *  1. Referral-Verarbeitung (delegiert an referralService)
 *  2. Preisberechnung (reine Funktion)
 *  3. DB-Persistenz
 *  4. Duplikat-Behandlung
 *
 * Ersetzt die monolithische `CustomersService.updateById()` god-method.
 */

import { customerRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { processReferral } from "./referralService";
import { evaluateReferralPolicy } from "./referralPolicy";
import { calcTotalEarnings } from "./referral";
import { NotFoundError, ConflictError } from "@/lib/errors";
import type { CustomerReadDto } from "./dto";
import { toCustomerReadDto } from "./dto";

/* ---------- Types ---------- */

export interface UpdateCustomerResult {
    data: CustomerReadDto;
    referralApplied: boolean;
    referrerReward: { message: string } | null;
}

/* ---------- Pure Functions ---------- */

/** Berechnet die abgeleiteten Felder für ein Update. */
function computeUpdateFields(
    body: Record<string, unknown>,
    existing: CustomerReadDto,
): { finalPrice: unknown; discountRate: unknown; totalEarnings: number } {
    const hasPriceUpdate = Object.prototype.hasOwnProperty.call(body, "price");
    const hasReferralCountUpdate = Object.prototype.hasOwnProperty.call(body, "referralCount");
    const nextPrice = hasPriceUpdate ? (body.price as number) : existing.price;
    const nextReferralCount = hasReferralCountUpdate
        ? (body.referralCount as number)
        : existing.referralCount;

    return {
        finalPrice: body.price,
        discountRate: existing.discountRate,
        totalEarnings: calcTotalEarnings(nextPrice, nextReferralCount),
    };
}

/** Versucht aus einem Duplikat-Fehler den Besitzer zu ermitteln. */
async function resolveDuplicateOwner(errorMessage: string, fallbackEmail: unknown): Promise<never> {
    const conflictEmailMatch = errorMessage.match(/\{\s*email:\s*"([^"]+)"\s*\}/);
    const conflictEmail = conflictEmailMatch ? conflictEmailMatch[1] : (fallbackEmail as string);

    try {
        const owner = await customerRepository.findUnique({ where: { email: conflictEmail } });
        if (owner) {
            const ownerDto = toCustomerReadDto(owner as unknown as Record<string, unknown>);
            throw new ConflictError(
                `This email address is already registered to: ${ownerDto.firstname} ${ownerDto.lastname}`,
            );
        }
    } catch (lookupErr) {
        if (lookupErr instanceof ConflictError) throw lookupErr;
    }

    throw new ConflictError("This email address is already registered.");
}

/* ---------- Use-Case ---------- */

export class CustomerUpdateUseCase {
    /**
     * Kunden aktualisieren inkl. Referral-Logik.
     * Orchestriert die einzelnen Schritte ohne selbst Logik zu enthalten.
     */
    static async execute(id: string, body: Record<string, unknown>): Promise<UpdateCustomerResult> {
        await connectToMongo();

        // 1. Existierenden Kunden laden & validieren
        const existingRaw = await customerRepository.findByIdExec(id);
        if (!existingRaw) {
            throw new NotFoundError("Customer not found");
        }
        const existing = toCustomerReadDto(existingRaw as unknown as Record<string, unknown>);

        // 2. Referral verarbeiten (nur bei Erstverwendung)
        const referralApplied = await this.tryProcessReferral(body, existing);

        // 3. Update-Daten berechnen (pure)
        const computed = computeUpdateFields(body, existing);
        const updateData: Record<string, unknown> = {
            ...body,
            finalPrice: computed.finalPrice,
            discountRate: computed.discountRate,
            totalEarnings: computed.totalEarnings,
            updatedAt: new Date(),
        };

        // 4. Persistieren mit Duplikat-Schutz
        const result = await this.persistUpdate(id, updateData);

        return {
            data: toCustomerReadDto(result as unknown as Record<string, unknown>),
            referralApplied,
            referrerReward: referralApplied
                ? { message: "Referral discount applied to the referrer." }
                : null,
        };
    }

    /** Referral policy'ye danışarak işlem kararı alır (OCP). */
    private static async tryProcessReferral(
        body: Record<string, unknown>,
        existing: CustomerReadDto,
    ): Promise<boolean> {
        const policy = evaluateReferralPolicy(body, existing);
        if (!policy.shouldApply) return false;

        const result = await processReferral(
            policy.referralCode!,
            policy.price,
            existing.id,
        );
        return result.referrerDiscount > 0;
    }

    /** Persistiert das Update und übersetzt DB-Fehler in Domain-Fehler. */
    private static async persistUpdate(
        id: string,
        updateData: Record<string, unknown>,
    ): Promise<unknown> {
        try {
            return await customerRepository.update({
                where: { id },
                data: updateData,
            });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (msg.includes("duplicate key") || msg.includes("E11000") || msg.includes("email_1")) {
                return resolveDuplicateOwner(msg, updateData.email);
            }
            throw err;
        }
    }
}
