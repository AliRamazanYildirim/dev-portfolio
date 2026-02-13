import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";
import { InvoiceData } from "@/lib/invoiceUtils";
import { renderHeader, renderInvoiceDetails, renderFromAndBillTo } from "./lib/pdfHeader";
import { renderProjectDetails, renderDeliverables } from "./lib/pdfBody";
import { renderPricing, renderPaymentInfo, renderFooter } from "./lib/pdfFooter";

// Ensure this API route runs on Node runtime (required for fs, path, jsPDF)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const invoiceData: InvoiceData = await request.json();

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // ── Render all sections ────────────────────────────────
    renderHeader(doc, pageWidth);
    renderInvoiceDetails(doc, pageWidth, invoiceData);
    renderFromAndBillTo(doc, pageWidth, invoiceData);
    renderProjectDetails(doc, pageWidth, invoiceData);
    renderDeliverables(doc, pageWidth, invoiceData);

    const { nextY: paymentY } = renderPricing(doc, pageWidth, invoiceData);
    const { nextY: footerY } = renderPaymentInfo(doc, pageWidth, paymentY);
    renderFooter(doc, pageWidth, footerY);

    // ── Output PDF ─────────────────────────────────────────
    const pdfBytes = doc.output("arraybuffer");

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
