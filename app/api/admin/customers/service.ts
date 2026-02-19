/**
 * Admin Customers API – Business Logic / Service Layer
 *
 * SRP-Refactored:
 *  - Welcome-E-Mail → WelcomeEmailService (lib/welcomeEmailService.ts)
 *  - Referral-Logik → processReferral (lib/referralService.ts)
 *  - Recalc-Logik → RecalcService (lib/recalcService.ts)
 *  - Dieser Service: reiner Kunden-CRUD + Orchestrierung
 */

import { customerRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { fetchCustomers } from "./lib/query";
import {
    calcTotalEarnings,
    generateUniqueReferralCode,
} from "./lib/referral";
import { processReferral } from "./lib/referralService";
import { WelcomeEmailService } from "./lib/welcomeEmailService";
import { RecalcService } from "./lib/recalcService";
import { NotFoundError, ConflictError } from "@/lib/errors";
import type { CreateCustomerRequest, CustomerQueryParams } from "./types";

export class CustomersService {
    /**
     * Alle Kunden mit optionalen Filtern/Sortierung abrufen
     */
    static async list(params: CustomerQueryParams) {
        return fetchCustomers({
            sort: params.sort,
            from: params.from,
            to: params.to,
            q: params.q,
        });
    }

    /**
     * Neuen Kunden erstellen inkl. Referral-Logik + Welcome-Mail
     */
    static async create(input: CreateCustomerRequest) {
        await connectToMongo();

        const finalPriceForNewCustomer = input.price || 0;

        // ------- Neuen Kunden anlegen -------
        const myReferralCode = await generateUniqueReferralCode();

        const customerData: Record<string, unknown> = {
            firstname: input.firstname || "",
            lastname: input.lastname || "",
            companyname: input.companyname || "",
            email: input.email,
            phone: input.phone || "",
            address: input.address || "",
            city: input.city || null,
            postcode: input.postcode || null,
            reference: input.reference || null,
            price: input.price,
            myReferralCode,
            finalPrice: finalPriceForNewCustomer,
            discountRate: null,
            referralCount: 0,
            createdAt: input.createdAt ? new Date(input.createdAt) : new Date(),
            updatedAt: new Date(),
        };

        const customer = await customerRepository.create({ data: customerData }) as unknown as Record<string, unknown>;

        // ------- Referral-Verarbeitung (delegiert an ReferralService) -------
        if (input.reference && input.price) {
            await processReferral(
                input.reference,
                input.price,
                String(customer._id),
            );
        }

        // ------- Welcome-Mail senden (delegiert an WelcomeEmailService) -------
        await WelcomeEmailService.send(
            {
                email: customer.email as string,
                firstname: customer.firstname as string,
                lastname: customer.lastname as string,
            },
            input.language || "de",
        );

        return customer;
    }

    /**
     * Einzelnen Kunden anhand der ID abrufen
     */
    static async getById(id: string) {
        await connectToMongo();
        const data = await customerRepository.findUnique({ where: { id } });
        if (!data) return null;

        const typedData = data as unknown as Record<string, unknown>;
        const computedTotalEarnings = calcTotalEarnings(
            typedData.price as number,
            typedData.referralCount as number,
        );
        const storedTotal = typeof typedData.totalEarnings === "number" ? typedData.totalEarnings : 0;

        if (Math.abs(storedTotal - computedTotalEarnings) > 0.009) {
            await customerRepository.update({
                where: { id },
                data: { totalEarnings: computedTotalEarnings, updatedAt: new Date() },
            });
            typedData.totalEarnings = computedTotalEarnings;
        }

        return typedData;
    }

    /**
     * Kunden aktualisieren inkl. Referral-Logik
     */
    static async updateById(id: string, body: Record<string, unknown>) {
        await connectToMongo();
        const existingCustomer = await customerRepository.findByIdExec(id);

        if (!existingCustomer) {
            throw new NotFoundError("Customer not found");
        }

        const existing = existingCustomer as unknown as Record<string, unknown>;

        // Referral-Verarbeitung nur bei Erstverwendung eines Codes
        let referralApplied = false;
        if (body.reference && body.price && !existing.reference) {
            const referralResult = await processReferral(
                body.reference as string,
                body.price as number,
                String(existing._id),
            );
            referralApplied = referralResult.referrerDiscount > 0;
        }

        const hasPriceUpdate = Object.prototype.hasOwnProperty.call(body, "price");
        const hasReferralCountUpdate = Object.prototype.hasOwnProperty.call(body, "referralCount");
        const nextPrice = hasPriceUpdate ? body.price as number : existing.price as number;
        const nextReferralCount = hasReferralCountUpdate
            ? body.referralCount as number
            : existing.referralCount as number;
        const nextTotalEarnings = calcTotalEarnings(nextPrice, nextReferralCount);

        const updateData: Record<string, unknown> = {
            ...body,
            finalPrice: body.price,
            discountRate: existing.discountRate,
            totalEarnings: nextTotalEarnings,
            updatedAt: new Date(),
        };

        try {
            const result = await customerRepository.update({
                where: { id },
                data: updateData as Record<string, unknown>,
            });
            return {
                data: result,
                referralApplied,
                referrerReward: referralApplied
                    ? { message: "Referral discount applied to the referrer." }
                    : null,
            };
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (msg.includes("duplicate key") || msg.includes("E11000") || msg.includes("email_1")) {
                try {
                    const conflictEmailMatch = msg.match(/\{\s*email:\s*"([^"]+)"\s*\}/);
                    const conflictEmail = conflictEmailMatch ? conflictEmailMatch[1] : updateData.email as string;
                    const owner = await customerRepository.findUnique({ where: { email: conflictEmail } });
                    if (owner) {
                        const ownerData = owner as unknown as Record<string, unknown>;
                        throw new ConflictError(
                            `This email address is already registered to: ${ownerData.firstname} ${ownerData.lastname}`,
                        );
                    }
                } catch (lookupErr) {
                    if (lookupErr instanceof ConflictError) throw lookupErr;
                }
                throw new ConflictError("This email address is already registered.");
            }
            throw err;
        }
    }

    /**
     * Kunden löschen
     */
    static async deleteById(id: string) {
        await connectToMongo();
        await customerRepository.delete({ where: { id } });
        return { success: true };
    }

    /**
     * FinalPrice neu berechnen (delegiert an RecalcService)
     */
    static async recalcFinalPrice(customerId: string) {
        return RecalcService.recalcFinalPrice(customerId);
    }
}
