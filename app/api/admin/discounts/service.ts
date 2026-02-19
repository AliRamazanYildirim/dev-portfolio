/**
 * Admin Discount Email Service – Business Logic Layer
 *
 * Encapsulates all discount email operations (send & reset).
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
import { sendAdminEmail } from "@/app/api/admin/customers/lib/mailer";
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

        const transaction = await referralRepository.findById(transactionId) as any;
        if (!transaction) {
            throw new NotFoundError("Transaction not found");
        }

        if (transaction.emailSent) {
            throw new ConflictError("Email already sent for this transaction");
        }

        const referrer = await customerRepository.findOneExec({
            myReferralCode: transaction.referrerCode,
        }) as any;

        if (!referrer) {
            throw new NotFoundError("Referrer not found");
        }

        if (!referrer.email) {
            throw new ValidationError("Referrer has no email address");
        }

        const referrerPrice = referrer.price || 0;
        const referralCount = referrer.referralCount || 0;

        if (isBonusRate && referralCount < 3) {
            throw new ValidationError("Bonus rate (+3%) is only available for customers who reached 9% (3+ referrals)");
        }

        let finalNewPrice: number;
        let actualDiscountRate: number | string;
        let emailHtml: string;
        let emailSubject: string;

        let bonusOriginalPrice: number | null = null;
        let bonusFinalPrice: number | null = null;
        let bonusAmount: number | null = null;

        if (isBonusRate) {
            const currentFinal =
                typeof referrer.finalPrice === "number" && !Number.isNaN(referrer.finalPrice)
                    ? Number(referrer.finalPrice)
                    : calcDiscountedPrice(referrerPrice, referralCount);

            const discountCents = Math.round(currentFinal * 0.03 * 100);
            const nextPrice = Math.round((currentFinal - discountCents / 100) * 100) / 100;
            const computedBonusAmount = Math.max(Math.round((currentFinal - nextPrice) * 100) / 100, 0);
            finalNewPrice = nextPrice;
            actualDiscountRate = "+3";

            bonusOriginalPrice = currentFinal;
            bonusFinalPrice = nextPrice;
            bonusAmount = computedBonusAmount;

            const bonusEmail = buildBonusEmailHTML({
                refFirst: referrer.firstname ?? "",
                refLast: referrer.lastname ?? "",
                myReferralCode: referrer.myReferralCode ?? "",
                referralCount,
                previousFinalPrice: currentFinal,
                newFinalPrice: finalNewPrice,
                bonusAmount: computedBonusAmount,
            });
            emailHtml = bonusEmail.html;
            emailSubject = bonusEmail.subject;
        } else {
            const referrerFinalPrice = calcDiscountedPrice(referrerPrice, referralCount);
            const previousPrice =
                referralCount > 1 ? calcDiscountedPrice(referrerPrice, referralCount - 1) : referrerPrice;
            const currentDiscountAmount = previousPrice - referrerFinalPrice;
            finalNewPrice = referrerFinalPrice;
            actualDiscountRate = discountRate as number;

            const standardEmail = buildReferrerEmailHTML({
                refFirst: referrer.firstname ?? "",
                refLast: referrer.lastname ?? "",
                myReferralCode: referrer.myReferralCode ?? "",
                newCount: referralCount,
                discountRate: discountRate as number,
                referrerPrice,
                referrerFinalPrice,
                currentDiscountAmount,
                discountsEnabled: true,
            });
            emailHtml = standardEmail.html;
            emailSubject = standardEmail.subject;
        }

        // Referrer finalPrice aktualisieren
        await customerRepository.update({
            where: { id: String(referrer._id) },
            data: {
                discountRate: isBonusRate ? 9 : discountRate,
                finalPrice: finalNewPrice,
                updatedAt: new Date(),
            },
        });

        await sendAdminEmail({
            to: referrer.email,
            subject: emailSubject,
            html: emailHtml,
        });

        // Transaction aktualisieren
        let newReferralLevel: number | undefined = transaction.referralLevel;
        if (isBonusRate) {
            const baseLevel =
                typeof transaction.referralLevel === "number"
                    ? transaction.referralLevel + 1
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
            bonusOriginalPrice !== null &&
            bonusFinalPrice !== null &&
            bonusAmount !== null
        ) {
            txUpdate.originalPrice = bonusOriginalPrice;
            txUpdate.finalPrice = bonusFinalPrice;
            txUpdate.discountAmount = bonusAmount;
        }

        await referralRepository.update({
            where: { id: transactionId },
            data: txUpdate,
        });

        return {
            transactionId,
            emailSent: true,
            discountRate: actualDiscountRate,
            referrerEmail: referrer.email,
            isBonus: isBonusRate,
        };
    }

    /**
     * Discount-E-Mail zurücksetzen (Reset)
     */
    static async resetEmail(transactionId: string, sendCorrectionEmail = true) {
        if (!transactionId) {
            throw new ValidationError("Transaction ID is required");
        }

        await connectToMongo();

        const transaction = await referralRepository.findById(transactionId) as any;
        if (!transaction) {
            throw new NotFoundError("Transaction not found");
        }

        if (!transaction.emailSent) {
            throw new ValidationError("Email was not sent for this transaction, nothing to reset");
        }

        const referrer = await customerRepository.findOneExec({
            myReferralCode: transaction.referrerCode,
        }) as any;

        if (!referrer) {
            throw new NotFoundError("Referrer not found");
        }

        const originalDiscountRate = transaction.discountRate;
        const originalAmount = Math.max(transaction.originalPrice - transaction.finalPrice, 0);

        // Korrektur-E-Mail senden
        if (sendCorrectionEmail && referrer.email) {
            const { html, subject } = buildCorrectionEmailHTML({
                refFirst: referrer.firstname ?? "",
                refLast: referrer.lastname ?? "",
                myReferralCode: referrer.myReferralCode ?? "",
                originalDiscountRate,
                originalAmount,
            });

            await sendAdminEmail({
                to: referrer.email,
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
