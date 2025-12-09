import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

interface CreateMailerResult {
    transporter: Transporter;
    from: string;
    isTestAccount: boolean;
}

interface SendReferralEmailOptions {
    to: string;
    subject: string;
    html: string;
}

async function createReferralMailer(): Promise<CreateMailerResult> {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const hasCredentials = Boolean(user && pass);

    if (hasCredentials) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user, pass },
        });

        await transporter.verify();

        const fromAddress = process.env.EMAIL_FROM || user || "no-reply@localhost";
        return {
            transporter,
            from: fromAddress,
            isTestAccount: false,
        };
    }

    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });

    console.warn(
        "EMAIL_USER/PASS not configured — using Ethereal test account for sending emails."
    );

    return {
        transporter,
        from: testAccount.user,
        isTestAccount: true,
    };
}

export async function sendReferralEmail(options: SendReferralEmailOptions) {
    const { transporter, from } = await createReferralMailer();

    const info = await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });

    return {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info) || null,
    };
}
