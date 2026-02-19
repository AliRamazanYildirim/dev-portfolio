/**
 * Admin Discount Email Service – Business Logic Layer
 *
 * SRP-Refactored:
 *  - Validierung/Lookup → DiscountEmailOrchestrator (dieser Service)
 *  - E-Mail-Versand → zentraler Mail Port (DIP)
 *  - Template-Erstellung → email-templates (unverändert)
 *  - DB-Operationen → Repositories
 *
 * Route handlers must NOT access Models directly.
 */

import { customerRepository, referralRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { calcDiscountedPrice } from "@/app/api/admin/customers/lib/referral";
import {
    buildReferrerEmailHTML,
    buildBonusEmailHTML,
    buildCorrectionEmailHTML,
} from "@/app/api/admin/customers/lib/email-templates";
import { getMailPort } from "@/lib/mail";
import { ValidationError, NotFoundError, ConflictError } from "@/lib/errors";

const VALID_RATES = [3, 6, 9] as const;
type ValidRate = (typeof VALID_RATES)[number];

function isValidRate(rate: unknown): rate is ValidRate | "+3" {
    if (rate === "+3") return true;
    return typeof rate === "number" && VALID_RATES.includes(rate as ValidRate);
}

export class DiscountEmailService {
    /**
     * Discount-E-Mail senden
     */
    static async sendEmail(transactionId: string, discountRate: unknown) {
        if (!transactionId) {
            throw new ValidationError("Transaction ID is required");
        }

        if (!isValidRate(discountRate)) {
            throw new ValidationError("Discount rate must be 3, 6, 9, or '+3' (bonus)");
        }

        const isBonusRate = discountRate === "+3";

        await connectToMongo();

        const transaction = await referralRepository.findById(transactionId) as Record<string, unknown> | null;
        if (!transaction) {
            throw new NotFoundError("Transaction not found");
        }

        if (transaction.emailSent) {
            throw new ConflictError("Email already sent for this transaction");
        }

        const referrer = await customerRepository.findOneExec({
            myReferralCode: transaction.referrerCode,
        }) as Record<string, unknown> | null;

        if (!referrer) {
            throw new NotFoundError("Referrer not found");
        }

        if (!referrer.email) {
            throw new ValidationError("Referrer has no email address");
        }

        const referrerPrice = (referrer.price as number) || 0;
        const referralCount = (referrer.referralCount as number) || 0;

        if (isBonusRate && referralCount < 3) {
            throw new ValidationError("Bonus rate (+3%) is only available for customers who reached 9% (3+ referrals)");
        }

        // --- E-Mail-Inhalt berechnen ---
        const emailContent = isBonusRate
            ? this.buildBonusContent(referrer, referrerPrice, referralCount)
            : this.buildStandardContent(referrer, referrerPrice, referralCount, discountRate as number);

        // --- Referrer DB-Update ---
        await customerRepository.update({
            where: { id: String(referrer._id) },
            data: {
                discountRate: isBonusRate ? 9 : discountRate,
                finalPrice: emailContent.finalNewPrice,
                updatedAt: new Date(),
            },
        });

        // --- E-Mail über Mail Port senden (DIP) ---
        const mailPort = getMailPort();
        await mailPort.send({
            to: referrer.email as string,
            subject: emailContent.subject,
            html: emailContent.html,
        });

        // --- Transaction DB-Update ---
        await this.updateTransaction(transactionId, transaction, isBonusRate, discountRate, referralCount, emailContent);

        return {
            transactionId,
            emailSent: true,
            discountRate: emailContent.actualDiscountRate,
            referrerEmail: referrer.email,
            isBonus: isBonusRate,
        };
    }

    /**
     * Bonus-E-Mail-Inhalt berechnen (+3%)
     */
    private static buildBonusContent(
        referrer: Record<string, unknown>,
        referrerPrice: number,
        referralCount: number,
    ) {
        const currentFinal =
            typeof referrer.finalPrice === "number" && !Number.isNaN(referrer.finalPrice)
                ? Number(referrer.finalPrice)
                : calcDiscountedPrice(referrerPrice, referralCount);

        const discountCents = Math.round(currentFinal * 0.03 * 100);
        const nextPrice = Math.round((currentFinal - discountCents / 100) * 100) / 100;
        const computedBonusAmount = Math.max(Math.round((currentFinal - nextPrice) * 100) / 100, 0);

        const bonusEmail = buildBonusEmailHTML({
            refFirst: (referrer.firstname as string) ?? "",
            refLast: (referrer.lastname as string) ?? "",
            myReferralCode: (referrer.myReferralCode as string) ?? "",
            referralCount,
            previousFinalPrice: currentFinal,
            newFinalPrice: nextPrice,
            bonusAmount: computedBonusAmount,
        });

        return {
            html: bonusEmail.html,
            subject: bonusEmail.subject,
            finalNewPrice: nextPrice,
            actualDiscountRate: "+3" as const,
            bonusOriginalPrice: currentFinal,
            bonusFinalPrice: nextPrice,
            bonusAmount: computedBonusAmount,
        };
    }

    /**
     * Standard-Rabatt-E-Mail-Inhalt berechnen (3/6/9%)
     */
    private static buildStandardContent(
        referrer: Record<string, unknown>,
        referrerPrice: number,
        referralCount: number,
        discountRate: number,
    ) {
        const referrerFinalPrice = calcDiscountedPrice(referrerPrice, referralCount);
        const previousPrice =
            referralCount > 1 ? calcDiscountedPrice(referrerPrice, referralCount - 1) : referrerPrice;
        const currentDiscountAmount = previousPrice - referrerFinalPrice;

        const standardEmail = buildReferrerEmailHTML({
            refFirst: (referrer.firstname as string) ?? "",
            refLast: (referrer.lastname as string) ?? "",
            myReferralCode: (referrer.myReferralCode as string) ?? "",
            newCount: referralCount,
            discountRate,
            referrerPrice,
            referrerFinalPrice,
            currentDiscountAmount,
            discountsEnabled: true,
        });

        return {
            html: standardEmail.html,
            subject: standardEmail.subject,
            finalNewPrice: referrerFinalPrice,
            actualDiscountRate: discountRate,
            bonusOriginalPrice: null as number | null,
            bonusFinalPrice: null as number | null,
            bonusAmount: null as number | null,
        };
    }

    /**
     * Transaction nach E-Mail-Versand aktualisieren
     */
    private static async updateTransaction(
        transactionId: string,
        transaction: Record<string, unknown>,
        isBonusRate: boolean,
        discountRate: unknown,
        referralCount: number,
        emailContent: { bonusOriginalPrice: number | null; bonusFinalPrice: number | null; bonusAmount: number | null },
    ) {
        let newReferralLevel: number | undefined = transaction.referralLevel as number | undefined;
        if (isBonusRate) {
            const baseLevel =
                typeof transaction.referralLevel === "number"
                    ? (transaction.referralLevel as number) + 1
                    : referralCount + 1;
            newReferralLevel = Math.min(baseLevel, referralCount);
        }

        const txUpdate: Record<string, unknown> = {
            emailSent: true,
            discountRate: isBonusRate ? 3 : discountRate,
            isBonus: isBonusRate,
            referralLevel: newReferralLevel,
        };

        if (
            isBonusRate &&
            emailContent.bonusOriginalPrice !== null &&
            emailContent.bonusFinalPrice !== null &&
            emailContent.bonusAmount !== null
        ) {
            txUpdate.originalPrice = emailContent.bonusOriginalPrice;
            txUpdate.finalPrice = emailContent.bonusFinalPrice;
            txUpdate.discountAmount = emailContent.bonusAmount;
        }

        await referralRepository.update({
            where: { id: transactionId },
            data: txUpdate,
        });
    }

    /**
     * Discount-E-Mail zurücksetzen (Reset)
     */
    static async resetEmail(transactionId: string, sendCorrectionEmail = true) {
        if (!transactionId) {
            throw new ValidationError("Transaction ID is required");
        }

        await connectToMongo();

        const transaction = await referralRepository.findById(transactionId) as Record<string, unknown> | null;
        if (!transaction) {
            throw new NotFoundError("Transaction not found");
        }

        if (!transaction.emailSent) {
            throw new ValidationError("Email was not sent for this transaction, nothing to reset");
        }

        const referrer = await customerRepository.findOneExec({
            myReferralCode: transaction.referrerCode,
        }) as Record<string, unknown> | null;

        if (!referrer) {
            throw new NotFoundError("Referrer not found");
        }

        const originalDiscountRate = transaction.discountRate as number;
        const originalAmount = Math.max(
            (transaction.originalPrice as number) - (transaction.finalPrice as number),
            0,
        );

        // Korrektur-E-Mail über Mail Port senden (DIP)
        if (sendCorrectionEmail && referrer.email) {
            const { html, subject } = buildCorrectionEmailHTML({
                refFirst: (referrer.firstname as string) ?? "",
                refLast: (referrer.lastname as string) ?? "",
                myReferralCode: (referrer.myReferralCode as string) ?? "",
                originalDiscountRate,
                originalAmount,
            });

            const mailPort = getMailPort();
            await mailPort.send({
                to: referrer.email as string,
                subject,
                html,
            });
        }

        // Transaction emailSent zurücksetzen
        await referralRepository.update({
            where: { id: transactionId },
            data: { emailSent: false, isBonus: false },
        });

        return {
            transactionId,
            emailSent: false,
            correctionEmailSent: sendCorrectionEmail && !!referrer.email,
            referrerEmail: referrer.email,
        };
    }
}
