/**
 * Admin Discounts – Input-Validierung.
 *
 * Prüft send-email und reset-email Bodies, bevor sie an den Service übergeben werden.
 */

import { ValidationError } from "@/lib/errors";
import type { SendDiscountEmailInput, ResetDiscountEmailInput } from "./types";

export function validateSendDiscountEmailBody(body: unknown): SendDiscountEmailInput {
    if (!body || typeof body !== "object") {
        throw new ValidationError("Request body is required");
    }

    const { transactionId, discountRate } = body as Record<string, unknown>;

    if (!transactionId || typeof transactionId !== "string") {
        throw new ValidationError("transactionId is required and must be a string");
    }

    if (discountRate === undefined || discountRate === null || typeof discountRate !== "number") {
        throw new ValidationError("discountRate is required and must be a number");
    }

    if (discountRate < 0 || discountRate > 100) {
        throw new ValidationError("discountRate must be between 0 and 100");
    }

    return { transactionId: transactionId.trim(), discountRate };
}

export function validateResetDiscountEmailBody(body: unknown): ResetDiscountEmailInput {
    if (!body || typeof body !== "object") {
        throw new ValidationError("Request body is required");
    }

    const { transactionId, sendCorrectionEmail } = body as Record<string, unknown>;

    if (!transactionId || typeof transactionId !== "string") {
        throw new ValidationError("transactionId is required and must be a string");
    }

    if (sendCorrectionEmail !== undefined && typeof sendCorrectionEmail !== "boolean") {
        throw new ValidationError("sendCorrectionEmail must be a boolean");
    }

    return {
        transactionId: transactionId.trim(),
        sendCorrectionEmail: sendCorrectionEmail as boolean | undefined,
    };
}
