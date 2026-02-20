/**
 * Discount Validate Use-Case – Phase 1: Daten laden & Regeln prüfen (SRP).
 *
 * Reine Validierung und Datenladung, keine Seiteneffekte.
 * Gibt ein typisiertes ValidatedDiscountContext zurück,
 * das die nachfolgenden Phasen (compute, persist) konsumieren.
 */

import { customerRepository, referralRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { toCustomerReadDto, type CustomerReadDto } from "@/app/api/admin/customers/lib/dto";
import type { IReferralTransaction } from "@/models/ReferralTransaction";
import {
    validateRate,
    checkBonusEligibility,
    checkEmailStatus,
    type DiscountRateInput,
} from "./discountPolicy";

/* ================================================================
 * TYPES
 * ================================================================ */

/** Vollständig validierter Kontext – bereit für Compute-Phase. */
export interface ValidatedDiscountContext {
    transactionId: string;
    transaction: IReferralTransaction;
    referrer: CustomerReadDto;
    discountRate: DiscountRateInput;
    isBonus: boolean;
}

/* ================================================================
 * USE-CASE
 * ================================================================ */

export class ValidateDiscountUseCase {
    /**
     * Lädt Transaktions- und Referrer-Daten, prüft Eligibility-Regeln.
     * Wirft spezifische Domain-Errors bei ungültigen Zuständen.
     * Erzeugt KEINE Seiteneffekte (kein DB-Write, kein Mail-Versand).
     */
    static async execute(
        transactionId: string,
        discountRate: unknown,
    ): Promise<ValidatedDiscountContext> {
        // 1. Input-Validierung (Typed Result Union)
        if (!transactionId) {
            throw new ValidationError("Transaction ID is required");
        }

        const rateResult = validateRate(discountRate);
        if (!rateResult.valid) {
            throw new ValidationError(rateResult.reason);
        }

        const { rate: typedRate, isBonus } = rateResult;

        await connectToMongo();

        // 2. Transaction laden & Status prüfen (Typed Result Union)
        const transaction = await referralRepository.findById(transactionId);
        if (!transaction) throw new NotFoundError("Transaction not found");

        const emailStatus = checkEmailStatus(transaction.emailSent);
        if (!emailStatus.canSend) {
            throw new ValidationError("Email already sent for this transaction");
        }

        // 3. Referrer laden & prüfen
        const referrerRaw = await customerRepository.findOneExec({
            myReferralCode: transaction.referrerCode,
        });
        if (!referrerRaw) throw new NotFoundError("Referrer not found");

        const referrer = toCustomerReadDto(referrerRaw as unknown as Record<string, unknown>);
        if (!referrer.email) throw new ValidationError("Referrer has no email address");

        // 4. Bonus-Eligibility (Typed Result Union)
        if (isBonus) {
            const bonusResult = checkBonusEligibility(referrer.referralCount);
            if (!bonusResult.eligible) {
                throw new ValidationError(bonusResult.reason);
            }
        }

        return {
            transactionId,
            transaction,
            referrer,
            discountRate: typedRate,
            isBonus,
        };
    }
}
