import { INVOICE_CONSTANTS } from "@/constants/invoice";
import { ValidationError } from "@/lib/errors";
import { resolveInvoiceDates } from "./lib/date-utils";
import { fetchInvoicePdf } from "./lib/pdf";
import { buildInvoiceHtml } from "./lib/mail-template";
import { getMailPort } from "@/lib/mail";
import type { InvoiceData } from "@/lib/invoiceUtils";

interface SendInvoiceInput {
    invoiceData: Record<string, unknown>;
    customerEmail: string;
    customerName: string;
}

interface SendInvoiceResult {
    message: string;
    customerEmail: string;
    invoiceNumber: string;
    pdfSize: number;
    messageId: string;
}

export class InvoiceEmailService {
    static async send(input: SendInvoiceInput): Promise<SendInvoiceResult> {
        const { invoiceData, customerEmail, customerName } = input;

        if (!invoiceData || !customerEmail || !customerName) {
            throw new ValidationError("Missing required fields");
        }

        const pdfBuffer = await fetchInvoicePdf(invoiceData as unknown as InvoiceData);
        const { issueDateFormatted, dueDateFormatted } = resolveInvoiceDates(invoiceData as unknown as InvoiceData);

        const displayProjectTitle = InvoiceEmailService.resolveProjectTitle(invoiceData);

        const html = buildInvoiceHtml({
            customerName,
            displayProjectTitle,
            invoiceData: invoiceData as unknown as InvoiceData,
            issueDateFormatted,
            dueDateFormatted,
        });

        const invoiceNumber = (invoiceData as Record<string, unknown>).invoiceNumber as string;

        // Mail über zentralen Mail Port senden (DIP)
        const mailPort = getMailPort();
        const result = await mailPort.send({
            to: customerEmail,
            subject: `Ihre Rechnung ${invoiceNumber} - Ali Ramazan Yildirim`,
            html,
            attachments: [
                {
                    filename: `invoice-${invoiceNumber}.pdf`,
                    content: pdfBuffer as unknown as Buffer,
                    contentType: "application/pdf",
                },
            ],
        });

        return {
            message: "Invoice email sent successfully with PDF attachment",
            customerEmail,
            invoiceNumber,
            pdfSize: (pdfBuffer as unknown as Buffer).length,
            messageId: result.messageId,
        };
    }

    private static resolveProjectTitle(invoiceData: Record<string, unknown>): string {
        const defaultTitle = INVOICE_CONSTANTS.PROJECT.DEFAULT_TITLE;
        const project = invoiceData.project as Record<string, unknown> | undefined;
        const rawTitle = (project?.title as string || "").trim();
        const category = (project?.category as string || "").trim();

        if ((!rawTitle || rawTitle === defaultTitle) && category) {
            return `Custom (${category}) Project`;
        }

        return rawTitle || defaultTitle;
    }
}
