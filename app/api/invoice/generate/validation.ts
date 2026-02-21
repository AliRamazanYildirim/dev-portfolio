/**
 * Invoice Generate API – Input Validation
 */

import type { InvoiceData } from "@/lib/invoiceUtils";

export function validateInvoiceData(
    body: unknown,
): { valid: true; value: InvoiceData } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    if (!obj.invoiceNumber || typeof obj.invoiceNumber !== "string") {
        return { valid: false, error: "Invoice number is required" };
    }

    if (!obj.issueDate || typeof obj.issueDate !== "string") {
        return { valid: false, error: "Issue date is required" };
    }

    if (!obj.dueDate || typeof obj.dueDate !== "string") {
        return { valid: false, error: "Due date is required" };
    }

    return {
        valid: true,
        value: obj as unknown as InvoiceData,
    };
}
