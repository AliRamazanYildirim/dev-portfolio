/**
 * Referral Policy – Domain kuralları (OCP/SRP).
 *
 * Referral eligibility ve discount hesaplama kurallarını
 * servis kodundan ayırır. Yeni kurallar bu modüle eklenir,
 * use-case kodu değişmez.
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

/** Referral işlemi sonrası sonuç */
export interface ReferralPolicyResult {
    shouldApply: boolean;
    referralCode: string | null;
    price: number;
}

/**
 * Referral işlenmeli mi, parametreleri neler?
 * Use-case bu fonksiyonu çağırarak karar alır.
 */
export function evaluateReferralPolicy(
    body: Record<string, unknown>,
    existing: CustomerReadDto,
): ReferralPolicyResult {
    if (!isFirstTimeReferralUse(body.reference, body.price, existing.reference)) {
        return { shouldApply: false, referralCode: null, price: 0 };
    }

    return {
        shouldApply: true,
        referralCode: body.reference as string,
        price: body.price as number,
    };
}
