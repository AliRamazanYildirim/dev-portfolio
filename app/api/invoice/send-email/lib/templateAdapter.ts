/**
 * Invoice Template Port – DIP: Template detaylarını domain'den ayırır.
 *
 * InvoiceEmailService bu interface'e bağımlıdır,
 * somut buildInvoiceHtml fonksiyonuna değil.
 */

import type { InvoiceData } from "@/lib/invoiceUtils";
import { buildInvoiceHtml } from "./mail-template";

/* ================================================================
 * PORT
 * ================================================================ */

export interface IInvoiceTemplateBuilder {
    buildInvoiceEmail(params: {
        customerName: string;
        displayProjectTitle: string;
        invoiceData: InvoiceData;
        issueDateFormatted: string;
        dueDateFormatted: string;
    }): string;
}

/* ================================================================
 * CONCRETE ADAPTER
 * ================================================================ */

export class DefaultInvoiceTemplateBuilder implements IInvoiceTemplateBuilder {
    buildInvoiceEmail(params: Parameters<IInvoiceTemplateBuilder["buildInvoiceEmail"]>[0]): string {
        return buildInvoiceHtml(params);
    }
}

/* ---------- Singleton → Composition Root ---------- */

export function getInvoiceTemplateBuilder(): IInvoiceTemplateBuilder {
    return new DefaultInvoiceTemplateBuilder();
}
