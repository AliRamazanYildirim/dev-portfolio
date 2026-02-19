/**
 * Admin Customers API – Business Logic / Service Layer
 */

import path from "path";
import fs from "fs";
import CustomerModel from "@/models/Customer";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import { connectToMongo } from "@/lib/mongodb";
import { getDiscountsEnabled } from "@/lib/discountSettings";
import { fetchCustomers } from "./lib/query";
import {
    calcDiscountedPrice,
    calcTotalEarnings,
    generateUniqueReferralCode,
} from "./lib/referral";
import { buildWelcomeEmailHTML } from "./lib/email-templates";
import { sendAdminEmail } from "./lib/mailer";
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

        const discountsEnabled = await getDiscountsEnabled();

        // ------- Referral-Verarbeitung -------
        let referrerCode: string | null = null;
        let referrerDiscount = 0;
        let referrerOriginalPrice: number | null = null;
        let referrerDiscountedPrice: number | null = null;
        let emailSent = false;
        let referrer: any = null;
        let newReferralCount = 0;

        const finalPriceForNewCustomer = input.price || 0;

        if (input.reference && input.price) {
            referrer = await CustomerModel.findOne({
                myReferralCode: input.reference,
            }).exec();

            if (referrer && referrer.price) {
                referrerCode = referrer.myReferralCode || null;

                const currentReferralCount = referrer.referralCount || 0;
                newReferralCount = currentReferralCount + 1;

                const previousPrice = calcDiscountedPrice(referrer.price, currentReferralCount);
                const referrerFinalPrice = calcDiscountedPrice(referrer.price, newReferralCount);
                referrerOriginalPrice = previousPrice;
                referrerDiscountedPrice = referrerFinalPrice;
                referrerDiscount = Math.min(newReferralCount * 3, 9);

                const referrerUpdateData: Record<string, any> = {
                    referralCount: newReferralCount,
                    updatedAt: new Date(),
                    totalEarnings: calcTotalEarnings(referrer.price, newReferralCount),
                };

                if (discountsEnabled) {
                    referrerUpdateData.discountRate = referrerDiscount;
                    referrerUpdateData.finalPrice = referrerFinalPrice;
                    emailSent = false;
                }

                try {
                    await CustomerModel.findByIdAndUpdate(referrer._id, referrerUpdateData).exec();
                } catch (updateErr) {
                    console.error("Error updating referrer:", updateErr);
                }
            }
        }

        // ------- Neuen Kunden anlegen -------
        const myReferralCode = await generateUniqueReferralCode();

        const customerData: any = {
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

        const customer = await CustomerModel.create(customerData);

        // ------- Referral-Transaktion erstellen -------
        if (referrerCode) {
            await ReferralTransactionModel.create({
                referrerCode,
                newCustomerId: customer._id.toString(),
                discountRate: referrerDiscount,
                originalPrice: referrerOriginalPrice ?? input.price,
                finalPrice: referrerDiscountedPrice ?? input.price,
                referralLevel: Math.ceil(referrerDiscount / 3),
                invoiceStatus: "pending",
                invoiceNumber: null,
                invoiceSentAt: null,
                emailSent,
            });
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
}
