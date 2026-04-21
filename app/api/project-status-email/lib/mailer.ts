import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";
import type { ProjectStatusPayload } from "./types";
import { buildStatusEmail, statusLabel } from "./template";

function normalizeCredential(value?: string): string | undefined {
    if (!value) {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeSmtpPassword(value?: string): string | undefined {
    const normalized = normalizeCredential(value);
    if (!normalized) {
        return undefined;
    }

    // Gmail app passwords are occasionally pasted with spaces.
    return normalized.replace(/\s+/g, "");
}

function hasErrorCode(error: unknown, code: string): boolean {
    if (!error || typeof error !== "object") {
        return false;
    }

    const maybeCode = Reflect.get(error, "code");
    return typeof maybeCode === "string" && maybeCode.toUpperCase() === code;
}

function hasErrorResponseCode(error: unknown, code: number): boolean {
    if (!error || typeof error !== "object") {
        return false;
    }

    const maybeResponseCode = Reflect.get(error, "responseCode");
    return typeof maybeResponseCode === "number" && maybeResponseCode === code;
}

function isSmtpAuthError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false;
    }

    const message = error.message.toLowerCase();

    if (
        message.includes("invalid login") ||
        message.includes("authentication") ||
        message.includes("username and password not accepted") ||
        message.includes("535-5.7.8")
    ) {
        return true;
    }

    return hasErrorCode(error, "EAUTH") || hasErrorResponseCode(error, 535);
}

export function mapProjectStatusMailError(error: unknown): Error {
    if (isSmtpAuthError(error)) {
        return new Error(
            "SMTP authentication failed. Verify SMTP_USER/SMTP_PASS (for Gmail use App Password).",
        );
    }

    if (error instanceof Error) {
        return error;
    }

    return new Error("Failed to send project status email");
}

export function createProjectStatusTransporter() {
    const host = normalizeCredential(process.env.SMTP_HOST) || "smtp.gmail.com";
    const portRaw = normalizeCredential(process.env.SMTP_PORT);
    const port = Number(portRaw || 587);
    const user = normalizeCredential(process.env.SMTP_USER);
    const pass = normalizeSmtpPassword(process.env.SMTP_PASS);

    if (!user || !pass) {
        throw new Error("SMTP credentials missing for project status email");
    }

    if (!Number.isFinite(port) || port <= 0) {
        throw new Error("SMTP port is invalid");
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });

    const from = normalizeCredential(process.env.FROM_EMAIL) || user;

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
