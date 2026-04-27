/**
 * Invoice Generate API – Input Validation
 */

import type { InvoiceData } from "@/lib/invoiceUtils";

// Sicheres Format: alphanumerisch + - _ / . ; max. 64 Zeichen.
// Verhindert Header-/Filename-Injection ueber CRLF, Anfuehrungszeichen, Pfad-Trennzeichen.
const INVOICE_NUMBER_PATTERN = /^[A-Za-z0-9._/-]{1,64}$/;
const MAX_DATE_LENGTH = 32;

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
    if (!INVOICE_NUMBER_PATTERN.test(obj.invoiceNumber)) {
        return { valid: false, error: "Invalid invoice number format" };
    }

    if (!obj.issueDate || typeof obj.issueDate !== "string" || obj.issueDate.length > MAX_DATE_LENGTH) {
        return { valid: false, error: "Issue date is required" };
    }

    if (!obj.dueDate || typeof obj.dueDate !== "string" || obj.dueDate.length > MAX_DATE_LENGTH) {
        return { valid: false, error: "Due date is required" };
    }

    return {
        valid: true,
        value: obj as unknown as InvoiceData,
    };
}
