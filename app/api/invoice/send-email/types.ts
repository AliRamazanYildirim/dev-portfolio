/**
 * Invoice Send Email API – Types & Interfaces
 */

import type { InvoiceData } from "@/lib/invoiceUtils";

export interface SendInvoiceInput {
    invoiceData: InvoiceData;
    customerEmail: string;
    customerName: string;
}

export interface SendInvoiceResult {
    message: string;
    customerEmail: string;
    invoiceNumber: string;
    pdfSize: number;
    messageId: string;
}
