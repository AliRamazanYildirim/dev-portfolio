/**
 * Discount Email Service – SOLID-Refactored (SRP + OCP + DIP).
 *
 * Änderungen gegenüber der alten Version:
 *  - sendEmail() orchestriert nur noch, enthält keine Geschäftslogik mehr (SRP)
 *  - Bonus/Standard-Strategien sind als reine Funktionen extrahiert (OCP)
 *  - Notification via IDiscountNotifier Port statt direktem getMailPort() (DIP)
 *  - Typ-sichere Customer-DTOs statt Record<string, unknown> (LSP/ISP)
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
import { getDiscountNotifier } from "@/lib/notifications";
import { ValidationError, NotFoundError, ConflictError } from "@/lib/errors";
import { toCustomerReadDto, type CustomerReadDto } from "@/app/api/admin/customers/lib/dto";

/* ================================================================
 * TYPES
 * ================================================================ */

const VALID_RATES = [3, 6, 9] as const;
type ValidRate = (typeof VALID_RATES)[number];
type DiscountRateInput = ValidRate | "+3";

interface EmailContent {
    html: string;
    subject: string;
    finalNewPrice: number;
    actualDiscountRate: number | "+3";
    bonusOriginalPrice: number | null;
    bonusFinalPrice: number | null;
    bonusAmount: number | null;
}

/* ================================================================
 * VALIDATION
 * ================================================================ */

function isValidRate(rate: unknown): rate is DiscountRateInput {
    if (rate === "+3") return true;
    return typeof rate === "number" && VALID_RATES.includes(rate as ValidRate);
}

/* ================================================================
 * DISCOUNT STRATEGIES – Reine Funktionen (OCP)
 * Neue Rabatttypen können ohne sendEmail-Änderung hinzugefügt werden.
 * ================================================================ */

function buildStandardEmailContent(
    referrer: CustomerReadDto,
    discountRate: number,
): EmailContent {
    const { referralCount, price: referrerPrice } = referrer;
    const referrerFinalPrice = calcDiscountedPrice(referrerPrice, referralCount);
    const previousPrice =
        referralCount > 1 ? calcDiscountedPrice(referrerPrice, referralCount - 1) : referrerPrice;
    const currentDiscountAmount = previousPrice - referrerFinalPrice;

    const standardEmail = buildReferrerEmailHTML({
        refFirst: referrer.firstname,
        refLast: referrer.lastname,
        myReferralCode: referrer.myReferralCode ?? "",
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
        bonusOriginalPrice: null,
        bonusFinalPrice: null,
        bonusAmount: null,
    };
}

function buildBonusEmailContent(referrer: CustomerReadDto): EmailContent {
    const currentFinal =
        typeof referrer.finalPrice === "number" && !Number.isNaN(referrer.finalPrice)
            ? referrer.finalPrice
            : calcDiscountedPrice(referrer.price, referrer.referralCount);

    const discountCents = Math.round(currentFinal * 0.03 * 100);
    const nextPrice = Math.round((currentFinal - discountCents / 100) * 100) / 100;
    const computedBonusAmount = Math.max(Math.round((currentFinal - nextPrice) * 100) / 100, 0);

    const bonusEmail = buildBonusEmailHTML({
        refFirst: referrer.firstname,
        refLast: referrer.lastname,
        myReferralCode: referrer.myReferralCode ?? "",
        referralCount: referrer.referralCount,
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

/* ================================================================
 * DATA ACCESS HELPERS – Laden & Validieren (SRP)
 * ================================================================ */

async function loadValidatedTransaction(transactionId: string) {
    const transaction = await referralRepository.findById(transactionId) as Record<string, unknown> | null;
    if (!transaction) throw new NotFoundError("Transaction not found");
    return transaction;
}

async function loadValidatedReferrer(referrerCode: unknown): Promise<CustomerReadDto> {
    const referrerRaw = await customerRepository.findOneExec({
        myReferralCode: referrerCode,
    }) as Record<string, unknown> | null;

    if (!referrerRaw) throw new NotFoundError("Referrer not found");

    const referrer = toCustomerReadDto(referrerRaw as Record<string, unknown>);
    if (!referrer.email) throw new ValidationError("Referrer has no email address");

    return referrer;
}

/* ================================================================
 * PERSISTENCE HELPERS (SRP)
 * ================================================================ */

async function updateReferrerDiscount(
    referrerId: string,
    isBonusRate: boolean,
    discountRate: DiscountRateInput,
    finalNewPrice: number,
) {
    await customerRepository.update({
        where: { id: referrerId },
        data: {
            discountRate: isBonusRate ? 9 : discountRate,
            finalPrice: finalNewPrice,
            updatedAt: new Date(),
        },
    });
}

async function updateTransactionAfterSend(
    transactionId: string,
    transaction: Record<string, unknown>,
    isBonusRate: boolean,
    discountRate: DiscountRateInput,
    referralCount: number,
    emailContent: EmailContent,
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

/* ================================================================
 * SERVICE – Dünne Orchestrierungsschicht
 * ================================================================ */

export class DiscountEmailService {
    /**
     * Discount-E-Mail senden – orchestriert nur, enthält keine Logik.
     */
    static async sendEmail(transactionId: string, discountRate: unknown) {
        if (!transactionId) throw new ValidationError("Transaction ID is required");
        if (!isValidRate(discountRate)) throw new ValidationError("Discount rate must be 3, 6, 9, or '+3' (bonus)");

        const isBonusRate = discountRate === "+3";
        await connectToMongo();

        // 1. Daten laden & validieren
        const transaction = await loadValidatedTransaction(transactionId);
        if (transaction.emailSent) throw new ConflictError("Email already sent for this transaction");

        const referrer = await loadValidatedReferrer(transaction.referrerCode);

        if (isBonusRate && referrer.referralCount < 3) {
            throw new ValidationError("Bonus rate (+3%) is only available for customers who reached 9% (3+ referrals)");
        }

        // 2. E-Mail-Inhalt berechnen (Strategy)
        const emailContent = isBonusRate
            ? buildBonusEmailContent(referrer)
            : buildStandardEmailContent(referrer, discountRate as number);

        // 3. Referrer aktualisieren
        await updateReferrerDiscount(referrer.id, isBonusRate, discountRate as DiscountRateInput, emailContent.finalNewPrice);

        // 4. E-Mail über Notification Port senden (DIP)
        const notifier = getDiscountNotifier();
        await notifier.notifyReferrer({
            to: referrer.email,
            subject: emailContent.subject,
            html: emailContent.html,
        });

        // 5. Transaction aktualisieren
        await updateTransactionAfterSend(
            transactionId, transaction, isBonusRate,
            discountRate as DiscountRateInput, referrer.referralCount, emailContent,
        );

        return {
            transactionId,
            emailSent: true,
            discountRate: emailContent.actualDiscountRate,
            referrerEmail: referrer.email,
            isBonus: isBonusRate,
        };
    }

    /**
     * Discount-E-Mail zurücksetzen (Reset)
     */
    static async resetEmail(transactionId: string, sendCorrectionEmail = true) {
        if (!transactionId) throw new ValidationError("Transaction ID is required");
        await connectToMongo();

        // 1. Daten laden & validieren
        const transaction = await loadValidatedTransaction(transactionId);
        if (!transaction.emailSent) throw new ValidationError("Email was not sent for this transaction, nothing to reset");

        const referrer = await loadValidatedReferrer(transaction.referrerCode);

        // 2. Korrektur-E-Mail senden (DIP)
        if (sendCorrectionEmail && referrer.email) {
            const originalDiscountRate = transaction.discountRate as number;
            const originalAmount = Math.max(
                (transaction.originalPrice as number) - (transaction.finalPrice as number),
                0,
            );

            const { html, subject } = buildCorrectionEmailHTML({
                refFirst: referrer.firstname,
                refLast: referrer.lastname,
                myReferralCode: referrer.myReferralCode ?? "",
                originalDiscountRate,
                originalAmount,
            });

            const notifier = getDiscountNotifier();
            await notifier.notifyCorrection({ to: referrer.email, subject, html });
        }

        // 3. Transaction zurücksetzen
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
