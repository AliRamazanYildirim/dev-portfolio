import CustomerModel from "@/models/Customer";

export function calcDiscountedPrice(originalPrice: number, referralCount: number) {
    if (referralCount === 0) {
        return originalPrice;
    }

    let currentPrice = originalPrice;
    for (let i = 1; i <= Math.min(referralCount, 3); i += 1) {
        const discountPercentage = i * 3;
        const discountAmount = currentPrice * (discountPercentage / 100);
        currentPrice -= discountAmount;
    }

    return currentPrice;
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
