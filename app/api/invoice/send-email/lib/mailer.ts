import nodemailer, { Transporter } from "nodemailer";
import { InvoiceData } from "@/lib/invoiceUtils";
import { buildInvoiceHtml } from "./mail-template";

interface MailOptionsParams {
    customerEmail: string;
    customerName: string;
    displayProjectTitle: string;
    invoiceData: InvoiceData;
    issueDateFormatted: string;
    dueDateFormatted: string;
    pdfBuffer: Buffer;
}

export async function createVerifiedTransporter(): Promise<Transporter> {
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim().replace(/\s+/g, "");

    if (!smtpUser || !smtpPass) {
        throw new Error(
            "Email service not configured. Please set SMTP_USER and SMTP_PASS environment variables."
        );
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    await transporter.verify();
    return transporter;
}

export function buildMailOptions({
    customerEmail,
    customerName,
    displayProjectTitle,
    invoiceData,
    issueDateFormatted,
    dueDateFormatted,
    pdfBuffer,
}: MailOptionsParams) {
    const html = buildInvoiceHtml({
        customerName,
        displayProjectTitle,
        invoiceData,
        issueDateFormatted,
        dueDateFormatted,
    });

    return {
        from: `"Ali Ramazan Yildirim" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Ihre Rechnung ${invoiceData.invoiceNumber} - Ali Ramazan Yildirim`,
        html,
        attachments: [
            {
                filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    };
}
