import { INVOICE_CONSTANTS } from "@/constants/invoice";
import { ValidationError } from "@/lib/errors";
import { resolveInvoiceDates } from "./lib/date-utils";
import { fetchInvoicePdf } from "./lib/pdf";
import { getInvoiceTemplateBuilder } from "./lib/templateAdapter";
import { getMailPort } from "@/lib/mail";
import type { InvoiceData } from "@/lib/invoiceUtils";
import type { SendInvoiceInput, SendInvoiceResult } from "./types";

export class InvoiceEmailService {
    static async send(input: SendInvoiceInput): Promise<SendInvoiceResult> {
        const { invoiceData, customerEmail, customerName } = input;

        if (!invoiceData || !customerEmail || !customerName) {
            throw new ValidationError("Missing required fields");
        }

        const pdfBuffer = await fetchInvoicePdf(invoiceData);
        const { issueDateFormatted, dueDateFormatted } = resolveInvoiceDates(invoiceData);

        const displayProjectTitle = InvoiceEmailService.resolveProjectTitle(invoiceData);

        // Template über Port erzeugen (DIP)
        const templateBuilder = getInvoiceTemplateBuilder();
        const html = templateBuilder.buildInvoiceEmail({
            customerName,
            displayProjectTitle,
            invoiceData,
            issueDateFormatted,
            dueDateFormatted,
        });

        const { invoiceNumber } = invoiceData;

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

    private static resolveProjectTitle(invoiceData: InvoiceData): string {
        const defaultTitle = INVOICE_CONSTANTS.PROJECT.DEFAULT_TITLE;
        const project = invoiceData.project;
        const rawTitle = (project?.title || "").trim();
        const category = (project?.category || "").trim();

        if ((!rawTitle || rawTitle === defaultTitle) && category) {
            return `Custom (${category}) Project`;
        }

        return rawTitle || defaultTitle;
    }
}
