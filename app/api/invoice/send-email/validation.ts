/**
 * Invoice Send Email API – Input Validation
 */

import { isValidEmail } from "@/lib/validation";
import type { InvoiceData } from "@/lib/invoiceUtils";

export function validateSendInvoiceBody(
    body: unknown,
): { valid: true; value: { invoiceData: InvoiceData; customerEmail: string; customerName: string } } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    if (!obj.invoiceData || typeof obj.invoiceData !== "object") {
        return { valid: false, error: "Invoice data is required" };
    }

    const invoiceData = obj.invoiceData as Record<string, unknown>;

    if (!invoiceData.invoiceNumber || typeof invoiceData.invoiceNumber !== "string") {
        return { valid: false, error: "Invoice number is required" };
    }

    if (!invoiceData.issueDate || typeof invoiceData.issueDate !== "string") {
        return { valid: false, error: "Issue date is required" };
    }

    if (!invoiceData.dueDate || typeof invoiceData.dueDate !== "string") {
        return { valid: false, error: "Due date is required" };
    }

    const customerEmail = typeof obj.customerEmail === "string" ? obj.customerEmail.trim() : "";
    if (!customerEmail) {
        return { valid: false, error: "Customer email is required" };
    }

    if (!isValidEmail(customerEmail)) {
        return { valid: false, error: "Invalid customer email format" };
    }

    const customerName = typeof obj.customerName === "string" ? obj.customerName.trim() : "";
    if (!customerName) {
        return { valid: false, error: "Customer name is required" };
    }

    return {
        valid: true,
        value: {
            invoiceData: obj.invoiceData as InvoiceData,
            customerEmail,
            customerName,
        },
    };
}
