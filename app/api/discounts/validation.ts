import type { DeleteDiscountInput, DiscountStatus, PatchDiscountInput } from "./types";

const ALLOWED_STATUS: DiscountStatus[] = ["pending", "sent"];

export function parseStatusFilter(status: string | null): DiscountStatus | undefined {
    if (!status) return undefined;
    if (ALLOWED_STATUS.includes(status as DiscountStatus)) {
        return status as DiscountStatus;
    }
    return undefined;
}

export function validatePatchDiscountBody(body: unknown):
    | { valid: true; value: PatchDiscountInput }
    | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;
    const id = typeof obj.id === "string" ? obj.id.trim() : "";

    if (!id) {
        return { valid: false, error: "Discount transaction id is required" };
    }

    const discountStatus =
        typeof obj.discountStatus === "string" ? obj.discountStatus : undefined;
    if (discountStatus && !ALLOWED_STATUS.includes(discountStatus as DiscountStatus)) {
        return { valid: false, error: "Invalid discount status" };
    }

    const discountNumber =
        obj.discountNumber === undefined
            ? undefined
            : obj.discountNumber === null
                ? null
                : String(obj.discountNumber);

    const discountSentAt =
        obj.discountSentAt === undefined
            ? undefined
            : obj.discountSentAt === null
                ? null
                : String(obj.discountSentAt);

    if (discountSentAt) {
        const parsedDate = new Date(discountSentAt);
        if (Number.isNaN(parsedDate.getTime())) {
            return { valid: false, error: "Invalid discountSentAt value" };
        }
    }

    if (
        discountStatus === undefined &&
        discountNumber === undefined &&
        discountSentAt === undefined
    ) {
        return { valid: false, error: "No update fields provided" };
    }

    return {
        valid: true,
        value: {
            id,
            discountStatus: discountStatus as DiscountStatus | undefined,
            discountNumber,
            discountSentAt,
        },
    };
}

export function validateDeleteDiscountBody(body: unknown):
    | { valid: true; value: DeleteDiscountInput }
    | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;
    const id = typeof obj.id === "string" ? obj.id.trim() : "";

    if (!id) {
        return { valid: false, error: "Discount transaction id is required" };
    }

    return { valid: true, value: { id } };
}
