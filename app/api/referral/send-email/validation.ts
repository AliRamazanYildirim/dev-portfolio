/**
 * Referral Send Email API – Input Validation
 */

import type { SendReferralEmailInput } from "./types";

export function validateSendReferralEmailBody(
    body: unknown,
): { valid: true; value: SendReferralEmailInput } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    const customerId = typeof obj.customerId === "string" ? obj.customerId.trim() : "";
    if (!customerId) {
        return { valid: false, error: "Customer ID is required" };
    }

    const customerEmail = typeof obj.customerEmail === "string"
        ? obj.customerEmail.trim() || undefined
        : undefined;

    return {
        valid: true,
        value: { customerId, customerEmail },
    };
}
