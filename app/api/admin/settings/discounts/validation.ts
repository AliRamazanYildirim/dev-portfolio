/**
 * Admin Settings / Discounts – Input-Validierung.
 */

import { ValidationError } from "@/lib/errors";
import type { DiscountSettingsInput } from "./types";

export function validateDiscountSettingsBody(body: unknown): DiscountSettingsInput {
    if (!body || typeof body !== "object") {
        throw new ValidationError("Request body is required");
    }

    const { enabled } = body as Record<string, unknown>;

    if (typeof enabled !== "boolean") {
        throw new ValidationError("'enabled' must be a boolean");
    }

    return { enabled };
}
