/**
 * Referral Policy – Domain kuralları (OCP/SRP).
 *
 * Referral eligibility ve discount hesaplama kurallarını
 * servis kodundan ayırır. Yeni kurallar bu modüle eklenir,
 * use-case kodu değişmez.
 *
 * v2: Typed Result Union – shouldApply discriminator ile
 * tip-güvenli branching sağlar. Tüketici kod `result.shouldApply`
 * kontrolünde TypeScript otomatik olarak doğru varyantı seçer.
 *
 * Tüm fonksiyonlar saf (pure).
 */

import type { CustomerReadDto } from "./dto";

/* ================================================================
 * ELIGIBILITY RULES
 * ================================================================ */

/**
 * Referral kodu ilk kez mi kullanılıyor?
 * Mevcut müşteri zaten bir reference'a sahipse, tekrar işlenmez.
 */
export function isFirstTimeReferralUse(
    newReference: unknown,
    newPrice: unknown,
    existingReference: string | null | undefined,
): boolean {
    return Boolean(newReference) && Boolean(newPrice) && !existingReference;
}

/**
 * Discount uygulama için gerekli şartlar sağlanıyor mu?
 */
export function isReferralEligible(
    referralCode: string | null | undefined,
    price: number | null | undefined,
): boolean {
    return Boolean(referralCode) && typeof price === "number" && price > 0;
}

/* ================================================================
 * DISCOUNT COMPUTATION (Pure)
 * ================================================================ */

/** Yeni discount rate hesapla (max 9%) */
export function computeDiscountRate(referralCount: number): number {
    return Math.min(referralCount * 3, 9);
}

/* ================================================================
 * TYPED RESULT UNION – Discriminated Policy Result
 * ================================================================ */

/** Referral uygulanacak – gerekli veriler mevcut */
export interface ReferralApplyResult {
    shouldApply: true;
    referralCode: string;
    price: number;
}

/** Referral uygulanmayacak – koşullar sağlanmadı */
export interface ReferralSkipResult {
    shouldApply: false;
    /** Neden uygulanmadığı */
    reason: ReferralSkipReason;
}

export type ReferralSkipReason =
    | "no_reference_provided"
    | "no_price_provided"
    | "already_has_reference";

/** Discriminated Union: TypeScript narrowing ile güvenli branching */
export type ReferralPolicyResult = ReferralApplyResult | ReferralSkipResult;

/**
 * Referral işlenmeli mi, parametreleri neler?
 * Use-case bu fonksiyonu çağırarak karar alır.
 *
 * TypeScript narrowing ile tüketici:
 * ```ts
 * const policy = evaluateReferralPolicy(body, existing);
 * if (policy.shouldApply) {
 *     // policy.referralCode: string (NOT null)
 *     // policy.price: number
 * }
 * ```
 */
export function evaluateReferralPolicy(
    body: Record<string, unknown>,
    existing: CustomerReadDto,
): ReferralPolicyResult {
    if (!body.reference) {
        return { shouldApply: false, reason: "no_reference_provided" };
    }
    if (!body.price) {
        return { shouldApply: false, reason: "no_price_provided" };
    }
    if (existing.reference) {
        return { shouldApply: false, reason: "already_has_reference" };
    }

    return {
        shouldApply: true,
        referralCode: body.reference as string,
        price: body.price as number,
    };
}
