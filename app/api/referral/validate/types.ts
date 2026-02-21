/**
 * Referral Validate API – Types & Interfaces
 */

export interface ValidateReferralInput {
    referralCode: string;
    basePrice: number;
}

export interface ReferrerResult {
    name: string;
    referralCount: number;
}

export interface DiscountResult {
    rate: number;
    amount: number;
    originalPrice: number;
    finalPrice: number;
    referralLevel: number;
}

export interface ValidateReferralResult {
    referrer: ReferrerResult;
    discount: DiscountResult;
}
