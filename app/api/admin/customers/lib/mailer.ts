import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

interface SendAdminEmailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: Attachment[];
}

export function createAdminCustomersMailer() {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    if (!user || !pass) {
        throw new Error("SMTP credentials are missing for admin customers mailer");
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });

    const fromEmail = process.env.FROM_EMAIL || user;
    const from = `"Ali Ramazan Yildirim" <${fromEmail}>`;

    return { transporter, from };
}

export async function sendAdminEmail(options: SendAdminEmailOptions) {
    const { transporter, from } = createAdminCustomersMailer();
    await transporter.verify();
    await transporter.sendMail({ from, ...options });
}
