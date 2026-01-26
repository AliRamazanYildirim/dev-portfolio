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
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error(
            "Email service not configured. Please set EMAIL_USER and EMAIL_PASS environment variables."
        );
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
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
        from: `"Ali Ramazan Yildirim" <${process.env.EMAIL_USER}>`,
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
