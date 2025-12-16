import db from "@/lib/db";

interface ValidateReferralInput {
    referralCode: string;
    basePrice: number;
}

interface ReferrerResult {
    name: string;
    referralCount: number;
}

interface DiscountResult {
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

function computeDiscount(basePrice: number, referralCount: number): DiscountResult {
    const clampedBasePrice = Math.max(0, basePrice);
    const safeReferralCount = Math.max(0, referralCount || 0);
    let discountRate = 3 + safeReferralCount * 3;
    discountRate = Math.min(discountRate, 9);

    const discountAmount = (clampedBasePrice * discountRate) / 100;
    const finalPrice = clampedBasePrice - discountAmount;

    return {
        rate: discountRate,
        amount: discountAmount,
        originalPrice: clampedBasePrice,
        finalPrice,
        referralLevel: Math.ceil(discountRate / 3),
    };
}

async function findReferrerByCode(referralCode: string) {
    return db.customer.findUnique({ where: { myReferralCode: referralCode } });
}

export async function validateReferral(
    input: ValidateReferralInput
): Promise<ValidateReferralResult> {
    const referrer = await findReferrerByCode(input.referralCode);
    if (!referrer) {
        throw new Error("Invalid referral code");
    }

    const discount = computeDiscount(input.basePrice, referrer.referralCount || 0);

    return {
        referrer: {
            name: `${referrer.firstname} ${referrer.lastname}`.trim(),
            referralCount: referrer.referralCount || 0,
        },
        discount,
    };
}
