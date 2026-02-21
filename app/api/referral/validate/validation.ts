/**
 * Referral Validate API – Input Validation
 */

import type { ValidateReferralInput } from "./types";

export function validateReferralInput(
    body: unknown,
): { valid: true; value: ValidateReferralInput } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    const referralCode = typeof obj.referralCode === "string" ? obj.referralCode.trim() : "";
    if (!referralCode) {
        return { valid: false, error: "Referral code is required" };
    }

    if (obj.basePrice === undefined || obj.basePrice === null) {
        return { valid: false, error: "Base price is required" };
    }

    const basePrice = Number(obj.basePrice);
    if (Number.isNaN(basePrice)) {
        return { valid: false, error: "Base price must be a number" };
    }

    return {
        valid: true,
        value: { referralCode, basePrice },
    };
}
