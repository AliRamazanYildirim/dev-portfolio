/**
 * SMTP Mail Adapter – Concrete Implementation of IMailPort.
 *
 * Sendet E-Mails über SMTP mit Nodemailer.  
 * Verwalten Sie die gesamte SMTP-Konfiguration an einem einzigen Ort.  
 */

import nodemailer from "nodemailer";
import type { IMailPort, SendMailOptions, SendMailResult } from "./types";

export interface SmtpConfig {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    secure: boolean;
}

function resolveSmtpConfig(): SmtpConfig {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || process.env.EMAIL_USER || "";
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || "";
    const fromEmail = process.env.FROM_EMAIL || user;
    const from = `"Ali Ramazan Yildirim" <${fromEmail}>`;

    return { host, port, user, pass, from, secure: port === 465 };
}

/**
 * Production-tauglicher SMTP Adapter.
 */
export class SmtpMailAdapter implements IMailPort {
    private config: SmtpConfig;

    constructor(config?: Partial<SmtpConfig>) {
        const defaults = resolveSmtpConfig();
        this.config = { ...defaults, ...config };
    }

    async send(options: SendMailOptions): Promise<SendMailResult> {
        if (!this.config.user || !this.config.pass) {
            throw new Error("SMTP credentials not configured (SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASS)");
        }

        const transporter = nodemailer.createTransport({
            host: this.config.host,
            port: this.config.port,
            secure: this.config.secure,
            auth: { user: this.config.user, pass: this.config.pass },
        });

        await transporter.verify();

        const info = await transporter.sendMail({
            from: this.config.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            attachments: options.attachments,
        });

        return {
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info) || null,
        };
    }
}

/**
 * Ethereal (test) fallback adapter – EMAIL_USER/PASS yoksa kullanılır.
 */
export class EtherealMailAdapter implements IMailPort {
    async send(options: SendMailOptions): Promise<SendMailResult> {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });

        console.warn("Using Ethereal test account for email sending.");

        const info = await transporter.sendMail({
            from: testAccount.user,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            attachments: options.attachments,
        });

        return {
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info) || null,
        };
    }
}
