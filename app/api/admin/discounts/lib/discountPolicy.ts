/**
 * Discount Policy – Domain kurallarını strateji/policy modülü olarak ayırır (OCP/SRP).
 *
 * Yeni discount türleri eklendiğinde servis kodu değişmez,
 * sadece bu modüle yeni bir strateji eklenir.
 *
 * v2: Eligibility sonuçları Typed Result Union ile modellendi.
 * Tüm fonksiyonlar saf (pure) – yan etki yok, test edilmesi kolay.
 */

import { calcDiscountedPrice, type CustomerReadDto } from "@/app/api/admin/customers/types";
import type { IReferralTransaction } from "@/models/ReferralTransaction";

/* ================================================================
 * TYPES
 * ================================================================ */

const VALID_RATES = [3, 6, 9] as const;
type ValidRate = (typeof VALID_RATES)[number];

export type DiscountRateInput = ValidRate | "+3";

export interface EmailContent {
    html: string;
    subject: string;
    finalNewPrice: number;
    actualDiscountRate: number | "+3";
    bonusOriginalPrice: number | null;
    bonusFinalPrice: number | null;
    bonusAmount: number | null;
}

export interface DiscountStrategy {
    buildEmailContent(referrer: CustomerReadDto): EmailContent;
}

/* ================================================================
 * TYPED RESULT UNIONS – Eligibility Checks
 * ================================================================ */

/** Rate validasyon sonucu */
export type RateValidationResult =
    | { valid: true; rate: DiscountRateInput; isBonus: boolean }
    | { valid: false; reason: string };

/** Bonus eligibility sonucu */
export type BonusEligibilityResult =
    | { eligible: true }
    | { eligible: false; reason: string; referralCount: number; required: number };

/** Email durum kontrolü sonucu */
export type EmailStatusResult =
    | { canSend: true }
    | { canSend: false; reason: "already_sent" };

/* ================================================================
 * VALIDATION – Pure (Typed Result Union)
 * ================================================================ */

export function isValidRate(rate: unknown): rate is DiscountRateInput {
    if (rate === "+3") return true;
    return typeof rate === "number" && VALID_RATES.includes(rate as ValidRate);
}

export function isBonusRate(rate: DiscountRateInput): rate is "+3" {
    return rate === "+3";
}

/** Tam typed rate validasyonu – caller discriminated union ile branching yapabilir */
export function validateRate(rate: unknown): RateValidationResult {
    if (!isValidRate(rate)) {
        return { valid: false, reason: "Discount rate must be 3, 6, 9, or '+3' (bonus)" };
    }
    return { valid: true, rate, isBonus: isBonusRate(rate) };
}

/* ================================================================
 * ELIGIBILITY RULES – Pure (Typed Result Union)
 * ================================================================ */

export function checkBonusEligibility(referralCount: number): BonusEligibilityResult {
    if (referralCount < 3) {
        return {
            eligible: false,
            reason: "Bonus rate (+3%) is only available for customers who reached 9% (3+ referrals)",
            referralCount,
            required: 3,
        };
    }
    return { eligible: true };
}

export function checkEmailStatus(emailSent: unknown): EmailStatusResult {
    if (emailSent) {
        return { canSend: false, reason: "already_sent" };
    }
    return { canSend: true };
}

/** @deprecated Prefer checkBonusEligibility() which returns typed result */
export function assertBonusEligible(referralCount: number): void {
    const result = checkBonusEligibility(referralCount);
    if (!result.eligible) throw new Error(result.reason);
}

/** @deprecated Prefer checkEmailStatus() which returns typed result */
export function assertEmailNotSent(emailSent: unknown): void {
    const result = checkEmailStatus(emailSent);
    if (!result.canSend) throw new Error("Email already sent for this transaction");
}

/* ================================================================
 * STRATEGIES – Reine Funktionen (OCP)
 * ================================================================ */

export interface IEmailTemplateBuilder {
    buildReferrerEmail(params: {
        refFirst: string;
        refLast: string;
        myReferralCode: string;
        newCount: number;
        discountRate: number;
        referrerPrice: number;
        referrerFinalPrice: number;
        currentDiscountAmount: number;
        discountsEnabled: boolean;
    }): { html: string; subject: string };

    buildBonusEmail(params: {
        refFirst: string;
        refLast: string;
        myReferralCode: string;
        referralCount: number;
        previousFinalPrice: number;
        newFinalPrice: number;
        bonusAmount: number;
    }): { html: string; subject: string };
}

export function buildStandardEmailContent(
    referrer: CustomerReadDto,
    discountRate: number,
    templateBuilder: IEmailTemplateBuilder,
): EmailContent {
    const { referralCount, price: referrerPrice } = referrer;
    const referrerFinalPrice = calcDiscountedPrice(referrerPrice, referralCount);
    const previousPrice =
        referralCount > 1 ? calcDiscountedPrice(referrerPrice, referralCount - 1) : referrerPrice;
    const currentDiscountAmount = previousPrice - referrerFinalPrice;

    const standardEmail = templateBuilder.buildReferrerEmail({
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

export function buildBonusEmailContent(
    referrer: CustomerReadDto,
    templateBuilder: IEmailTemplateBuilder,
): EmailContent {
    const currentFinal =
        typeof referrer.finalPrice === "number" && !Number.isNaN(referrer.finalPrice)
            ? referrer.finalPrice
            : calcDiscountedPrice(referrer.price, referrer.referralCount);

    const discountCents = Math.round(currentFinal * 0.03 * 100);
    const nextPrice = Math.round((currentFinal - discountCents / 100) * 100) / 100;
    const computedBonusAmount = Math.max(Math.round((currentFinal - nextPrice) * 100) / 100, 0);

    const bonusEmail = templateBuilder.buildBonusEmail({
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
 * PERSISTENCE COMPUTATION – Pure (berechnet Update-Daten)
 * ================================================================ */

export interface TransactionUpdateData {
    emailSent: boolean;
    discountRate: number | "+3";
    isBonus: boolean;
    referralLevel?: number;
    originalPrice?: number;
    finalPrice?: number;
    discountAmount?: number;
    [key: string]: unknown;
}

export function computeTransactionUpdate(
    transaction: IReferralTransaction,
    isBonusRate: boolean,
    discountRate: DiscountRateInput,
    referralCount: number,
    emailContent: EmailContent,
): TransactionUpdateData {
    let newReferralLevel: number | undefined = transaction.referralLevel;
    if (isBonusRate) {
        const baseLevel =
            typeof transaction.referralLevel === "number"
                ? transaction.referralLevel + 1
                : referralCount + 1;
        newReferralLevel = Math.min(baseLevel, referralCount);
    }

    const result: TransactionUpdateData = {
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
        result.originalPrice = emailContent.bonusOriginalPrice;
        result.finalPrice = emailContent.bonusFinalPrice;
        result.discountAmount = emailContent.bonusAmount;
    }

    return result;
}

/** Typisiertes Referrer-Update für Persistenz */
export interface ReferrerUpdateData {
    discountRate: number;
    finalPrice: number;
    updatedAt: Date;
    [key: string]: unknown;
}

export function computeReferrerUpdate(
    isBonusRate: boolean,
    discountRate: DiscountRateInput,
    finalNewPrice: number,
): ReferrerUpdateData {
    return {
        discountRate: isBonusRate ? 9 : (discountRate as number),
        finalPrice: finalNewPrice,
        updatedAt: new Date(),
    };
}
