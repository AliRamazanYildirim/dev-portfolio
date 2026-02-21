/**
 * Invoice Generate API – Service Layer
 *
 * Erzeugt ein PDF-Dokument aus den Rechnungsdaten.
 * Route-Handler delegiert hierher – keine Geschäftslogik in route.ts.
 */

import jsPDF from "jspdf";
import { renderHeader, renderInvoiceDetails, renderFromAndBillTo } from "./lib/pdfHeader";
import { renderProjectDetails, renderDeliverables } from "./lib/pdfBody";
import { renderPricing, renderPaymentInfo, renderFooter } from "./lib/pdfFooter";
import type { InvoiceData } from "@/lib/invoiceUtils";

/* ================================================================
 * TYPES
 * ================================================================ */

export interface GeneratePdfResult {
    pdfBytes: ArrayBuffer;
    invoiceNumber: string;
}

/* ================================================================
 * SERVICE
 * ================================================================ */

export class InvoiceGenerateService {
    /**
     * Erzeugt ein PDF aus den Rechnungsdaten.
     */
    static generate(invoiceData: InvoiceData): GeneratePdfResult {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });

        const pageWidth = doc.internal.pageSize.getWidth();

        // Render all sections
        renderHeader(doc, pageWidth);
        renderInvoiceDetails(doc, pageWidth, invoiceData);
        renderFromAndBillTo(doc, pageWidth, invoiceData);
        renderProjectDetails(doc, pageWidth, invoiceData);
        renderDeliverables(doc, pageWidth, invoiceData);

        const { nextY: paymentY } = renderPricing(doc, pageWidth, invoiceData);
        const { nextY: footerY } = renderPaymentInfo(doc, pageWidth, paymentY);
        renderFooter(doc, pageWidth, footerY);

        return {
            pdfBytes: doc.output("arraybuffer"),
            invoiceNumber: invoiceData.invoiceNumber,
        };
    }
}
