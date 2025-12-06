import { NextRequest, NextResponse } from "next/server";
import { INVOICE_CONSTANTS } from "@/constants/invoice";
import { resolveInvoiceDates } from "./lib/date-utils";
import { fetchInvoicePdf } from "./lib/pdf";
import {
  buildMailOptions,
  createVerifiedTransporter,
} from "./lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const { invoiceData, customerEmail, customerName } = await request.json();

    if (!invoiceData || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pdfBuffer = await fetchInvoicePdf(invoiceData);
    const { issueDateFormatted, dueDateFormatted } =
      resolveInvoiceDates(invoiceData);

    const defaultProjectTitle = INVOICE_CONSTANTS.PROJECT.DEFAULT_TITLE;
    const rawTitle = (invoiceData.project?.title || "").trim();
    const category = (invoiceData.project?.category || "").trim();
    const displayProjectTitle =
      (!rawTitle || rawTitle === defaultProjectTitle) && category
        ? `Custom (${category}) Project`
        : rawTitle || defaultProjectTitle;

    const transporter = await createVerifiedTransporter();
    const mailOptions = buildMailOptions({
      customerEmail,
      customerName,
      displayProjectTitle,
      invoiceData,
      issueDateFormatted,
      dueDateFormatted,
      pdfBuffer,
    });

    const result = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      data: {
        message: "Invoice email sent successfully with PDF attachment",
        customerEmail,
        invoiceNumber: invoiceData.invoiceNumber,
        pdfSize: pdfBuffer.length,
        messageId: result.messageId,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to prepare invoice email",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
