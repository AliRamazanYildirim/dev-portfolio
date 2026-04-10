/**
 * Referral Validate API – Input Validation
 */

import type { ValidateReferralInput } from "./types";

const REFERRAL_CODE_REGEX = /^[a-zA-Z0-9_-]+$/;
const MAX_REFERRAL_CODE_LENGTH = 64;

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

    if (referralCode.length > MAX_REFERRAL_CODE_LENGTH) {
        return { valid: false, error: "Referral code is too long" };
    }

    if (!REFERRAL_CODE_REGEX.test(referralCode)) {
        return { valid: false, error: "Referral code contains invalid characters" };
    }

    if (obj.basePrice === undefined || obj.basePrice === null) {
        return { valid: false, error: "Base price is required" };
    }

    const basePrice = Number(obj.basePrice);
    if (!Number.isFinite(basePrice)) {
        return { valid: false, error: "Base price must be a number" };
    }

    if (basePrice <= 0) {
        return { valid: false, error: "Base price must be greater than 0" };
    }

    return {
        valid: true,
        value: { referralCode, basePrice },
    };
}
