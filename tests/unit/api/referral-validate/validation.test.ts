import { describe, expect, it } from "vitest";
import { validateReferralInput } from "@/app/api/referral/validate/validation";

describe("referral validate input", () => {
    it("rejects referral code with invalid characters", () => {
        const result = validateReferralInput({
            referralCode: "bad code!",
            basePrice: 1200,
        });

        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toBe("Referral code contains invalid characters");
        }
    });

    it("rejects non-positive base price", () => {
        const result = validateReferralInput({
            referralCode: "CODE_123",
            basePrice: 0,
        });

        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toBe("Base price must be greater than 0");
        }
    });

    it("accepts valid payload", () => {
        const result = validateReferralInput({
            referralCode: "CODE_123",
            basePrice: 3000,
        });

        expect(result.valid).toBe(true);
        if (result.valid) {
            expect(result.value.referralCode).toBe("CODE_123");
            expect(result.value.basePrice).toBe(3000);
        }
    });
});
