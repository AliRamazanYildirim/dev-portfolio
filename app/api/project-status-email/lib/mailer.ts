import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";
import type { ProjectStatusPayload } from "./types";
import { buildStatusEmail, statusLabel } from "./template";

export function createProjectStatusTransporter() {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    if (!user || !pass) {
        throw new Error("SMTP credentials missing for project status email");
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });

    const from = process.env.FROM_EMAIL || user;

    return { transporter, from };
}

interface BuildMailPayloadParams {
    payload: ProjectStatusPayload;
    baseUrl?: string;
    from: string;
    attachments?: Attachment[];
    logoCid?: string;
}

export function buildMailPayload({
    payload,
    baseUrl,
    from,
    attachments = [],
    logoCid,
}: BuildMailPayloadParams) {
    const { html, text } = buildStatusEmail(payload, { baseUrl, logoCid });
    const subject = `Update zu Ihrem Projekt: ${statusLabel(payload.status)}`;

    return {
        from,
        to: payload.clientEmail,
        subject,
        html,
        text,
        attachments,
    };
}
