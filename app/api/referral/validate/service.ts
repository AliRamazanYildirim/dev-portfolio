import { customerRepository } from "@/lib/repositories";
import { getDiscountsEnabled } from "@/lib/discountSettings";
import { NotFoundError, ConflictError } from "@/lib/errors";
import type {
    ValidateReferralInput,
    ValidateReferralResult,
    DiscountResult,
} from "./types";

function toSafeReferrerName(firstname: string | undefined, lastname: string | undefined): string {
    const first = (firstname || "").trim();
    const last = (lastname || "").trim();
    const lastInitial = last ? `${last.charAt(0)}.` : "";
    const displayName = [first, lastInitial].filter(Boolean).join(" ").trim();
    return displayName || "Referral Partner";
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
    return customerRepository.findUnique({ where: { myReferralCode: referralCode } });
}

export async function validateReferral(
    input: ValidateReferralInput
): Promise<ValidateReferralResult> {
    // Business-Regel: Rabatte müssen aktiviert sein
    const discountsEnabled = await getDiscountsEnabled();
    if (!discountsEnabled) {
        throw new ConflictError("Discounts are disabled");
    }

    const referrer = await findReferrerByCode(input.referralCode);
    if (!referrer) {
        throw new NotFoundError("Referral code could not be validated");
    }

    const discount = computeDiscount(input.basePrice, referrer.referralCount || 0);

    return {
        referrer: {
            name: toSafeReferrerName(referrer.firstname, referrer.lastname),
            referralCount: referrer.referralCount || 0,
        },
        discount,
    };
}
