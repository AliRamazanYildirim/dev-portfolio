import { INVOICE_CONSTANTS } from "@/constants/invoice";
import { ValidationError } from "@/lib/errors";
import { resolveInvoiceDates } from "./lib/date-utils";
import { fetchInvoicePdf } from "./lib/pdf";
import { buildMailOptions, createVerifiedTransporter } from "./lib/mailer";

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

        const pdfBuffer = await fetchInvoicePdf(invoiceData as any);
        const { issueDateFormatted, dueDateFormatted } = resolveInvoiceDates(invoiceData as any);

        const displayProjectTitle = InvoiceEmailService.resolveProjectTitle(invoiceData);

        const transporter = await createVerifiedTransporter();
        const mailOptions = buildMailOptions({
            customerEmail,
            customerName,
            displayProjectTitle,
            invoiceData: invoiceData as any,
            issueDateFormatted,
            dueDateFormatted,
            pdfBuffer,
        });

        const result = await transporter.sendMail(mailOptions);

        return {
            message: "Invoice email sent successfully with PDF attachment",
            customerEmail,
            invoiceNumber: (invoiceData as any).invoiceNumber,
            pdfSize: pdfBuffer.length,
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
