/**
 * Admin Customers API – Business Logic / Service Layer
 */

import path from "path";
import fs from "fs";
import { customerRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { fetchCustomers } from "./lib/query";
import {
    calcDiscountedPrice,
    calcTotalEarnings,
    generateUniqueReferralCode,
} from "./lib/referral";
import { processReferral } from "./lib/referralService";
import { buildWelcomeEmailHTML } from "./lib/email-templates";
import { sendAdminEmail } from "./lib/mailer";
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

        // ------- Welcome-Mail senden -------
        await this.sendWelcomeEmail(customer, input.language || "de");

        return customer;
    }

    /**
     * Willkommens-E-Mail mit Vertrag senden
     */
    private static async sendWelcomeEmail(
        customer: any,
        language: string,
    ) {
        if (!customer.email) return;

        try {
            const welcomeEmail = buildWelcomeEmailHTML({
                firstName: customer.firstname || "",
                lastName: customer.lastname || "",
                language,
            });

            const pdfPath = path.join(
                process.cwd(),
                "public",
                "contracts",
                "IT_Service_Agreement_EN-DE-TR.pdf",
            );
            const pdfExists = fs.existsSync(pdfPath);

            if (!pdfExists) {
                console.warn("Contract PDF not found at:", pdfPath);
            }

            await sendAdminEmail({
                to: customer.email,
                subject: welcomeEmail.subject,
                html: welcomeEmail.html,
                attachments: pdfExists
                    ? [
                        {
                            filename: "IT_Service_Agreement_EN-DE-TR.pdf",
                            path: pdfPath,
                            contentType: "application/pdf",
                        },
                    ]
                    : undefined,
            });

            console.log("Welcome email sent to:", customer.email);
        } catch (emailErr) {
            console.error("Failed sending welcome email:", emailErr);
            // E-Mail-Fehler soll Kundenanlage nicht blockieren
        }
    }

    /**
     * Einzelnen Kunden anhand der ID abrufen
     */
    static async getById(id: string) {
        await connectToMongo();
        const data = await customerRepository.findUnique({ where: { id } }) as any;
        if (!data) return null;

        const computedTotalEarnings = calcTotalEarnings(data.price, data.referralCount);
        const storedTotal = typeof data.totalEarnings === "number" ? data.totalEarnings : 0;

        if (Math.abs(storedTotal - computedTotalEarnings) > 0.009) {
            await customerRepository.update({
                where: { id },
                data: { totalEarnings: computedTotalEarnings, updatedAt: new Date() },
            });
            data.totalEarnings = computedTotalEarnings;
        }

        return data;
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

        // Referral-Verarbeitung nur bei Erstverwendung eines Codes (delegiert an ReferralService)
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
                data: updateData as any,
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
                        throw new ConflictError(
                            `This email address is already registered to: ${owner.firstname} ${owner.lastname}`,
                        );
                    }
                } catch (lookupErr) {
                    if (lookupErr instanceof ConflictError) throw lookupErr;
                    // ignore lookup errors
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
     * FinalPrice neu berechnen
     */
    static async recalcFinalPrice(customerId: string) {
        await connectToMongo();
        const customer = await customerRepository.findByIdExec(customerId);
        if (!customer) {
            throw new NotFoundError("Customer not found");
        }

        const basePrice = typeof (customer as any).price === "number" ? Number((customer as any).price) : 0;
        const refCount = typeof (customer as any).referralCount === "number" ? (customer as any).referralCount : 0;

        const newFinal = calcDiscountedPrice(basePrice, refCount);
        const totalEarnings = calcTotalEarnings(basePrice, refCount);

        await customerRepository.update({
            where: { id: String((customer as any)._id) },
            data: { finalPrice: newFinal, totalEarnings, updatedAt: new Date() },
        });

        return { id: (customer as any)._id, finalPrice: newFinal, totalEarnings };
    }
}
