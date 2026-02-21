import { NextRequest, NextResponse } from "next/server";
import { InvoiceGenerateService } from "./service";
import { validateInvoiceData } from "./validation";
import { handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

// Ensure this API route runs on Node runtime (required for fs, path, jsPDF)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Input validieren
    const validation = validateInvoiceData(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const { pdfBytes, invoiceNumber } = InvoiceGenerateService.generate(validation.value);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    return handleError(error, "PDF generation error");
  }
}
