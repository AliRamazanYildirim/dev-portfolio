import CustomerModel from "@/models/Customer";

export function calcDiscountedPrice(originalPrice: number, referralCount: number) {
    if (!referralCount || referralCount <= 0) {
        return Math.round(originalPrice * 100) / 100;
    }

    // Apply repeated 3% steps on the running subtotal, rounding cents each step.
    let currentPrice = Math.round(originalPrice * 100) / 100;
    for (let i = 0; i < referralCount; i += 1) {
        const discountCents = Math.round(currentPrice * 0.03 * 100);
        const discount = discountCents / 100;
        currentPrice = Math.round((currentPrice - discount) * 100) / 100;
    }

    return currentPrice;
}

export function calcTotalEarnings(
    originalPrice: number | null | undefined,
    referralCount: number | null | undefined
) {
    if (typeof originalPrice !== "number" || Number.isNaN(originalPrice) || originalPrice <= 0) {
        return 0;
    }

    const count = Math.max(0, Number(referralCount || 0));
    const finalPrice = calcDiscountedPrice(originalPrice, count);
    const total = originalPrice - finalPrice;
    return Math.max(Math.round(total * 100) / 100, 0);
}

export function generateReferralCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function generateUniqueReferralCode() {
    let code = generateReferralCode();
    let exists = true;

    while (exists) {
        const existing = await CustomerModel.findOne({ myReferralCode: code }).lean().exec();
        if (!existing) {
            exists = false;
        } else {
            code = generateReferralCode();
        }
    }

    return code;
}
