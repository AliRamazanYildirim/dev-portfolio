/**
 * SMTP Mail Adapter – Concrete Implementation of IMailPort.
 *
 * Sendet E-Mails über SMTP mit Nodemailer.
 * Verwalten Sie die gesamte SMTP-Konfiguration an einem einzigen Ort.
 */

import nodemailer from "nodemailer";
import type { IMailPort, SendMailOptions, SendMailResult } from "./types";

interface SmtpCredentials {
    user: string;
    pass: string;
}

export interface SmtpConfig {
    host: string;
    port: number;
    credentials: SmtpCredentials[];
    fromEmail: string;
    secure: boolean;
}

function normalizeCredential(value?: string): string {
    if (!value) {
        return "";
    }

    return value.trim();
}

function normalizeSmtpPassword(value?: string): string {
    const normalized = normalizeCredential(value);
    if (!normalized) {
        return "";
    }

    // Gmail app passwords are commonly copied with spaces.
    return normalized.replace(/\s+/g, "");
}

function resolveSmtpCredentials(): SmtpCredentials[] {
    const candidates: SmtpCredentials[] = [];

    const addCandidate = (rawUser?: string, rawPass?: string): void => {
        const user = normalizeCredential(rawUser);
        const pass = normalizeSmtpPassword(rawPass);
        if (!user || !pass) {
            return;
        }

        const alreadyExists = candidates.some(
            (candidate) => candidate.user === user && candidate.pass === pass,
        );
        if (alreadyExists) {
            return;
        }

        candidates.push({ user, pass });
    };

    addCandidate(process.env.SMTP_USER, process.env.SMTP_PASS);

    return candidates;
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

function buildAuthErrorFromAttemptCount(attemptCount: number): Error {
    const baseMessage =
        "SMTP authentication failed. Verify SMTP_USER/SMTP_PASS (for Gmail use App Password).";

    if (attemptCount <= 1) {
        return new Error(baseMessage);
    }

    return new Error(`${baseMessage} Tried ${attemptCount} credential sets.`);
}

function mapSmtpSendError(error: unknown, attemptCount = 1): Error {
    if (isSmtpAuthError(error)) {
        return buildAuthErrorFromAttemptCount(attemptCount);
    }

    if (error instanceof Error) {
        return error;
    }

    return new Error("Failed to send email over SMTP");
}

function mapAllAuthAttemptsFailed(lastError: unknown, attemptCount: number): Error {
    if (isSmtpAuthError(lastError)) {
        return buildAuthErrorFromAttemptCount(attemptCount);
    }

    return mapSmtpSendError(lastError, attemptCount);
}

function buildFromHeader(fromEmail: string): string {
    return `"Ali Ramazan Yildirim" <${fromEmail}>`;
}

function resolveFromEmail(explicitFromEmail: string, credentials: SmtpCredentials): string {
    return explicitFromEmail || credentials.user;
}

function isTestFallbackEnabled(): boolean {
    return normalizeCredential(process.env.MAIL_ALLOW_ETHEREAL_FALLBACK).toLowerCase() === "true";
}

function resolveSmtpConfig(): SmtpConfig {
    const host = normalizeCredential(process.env.SMTP_HOST) || "smtp.gmail.com";
    const port = Number(normalizeCredential(process.env.SMTP_PORT) || 587);
    const credentials = resolveSmtpCredentials();
    const fromEmail = normalizeCredential(process.env.FROM_EMAIL);

    if (!Number.isFinite(port) || port <= 0) {
        throw new Error("SMTP port is invalid");
    }

    return {
        host,
        port,
        credentials,
        fromEmail,
        secure: port === 465,
    };
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
        if (!this.config.credentials.length) {
            throw new Error("SMTP credentials not configured (SMTP_USER/SMTP_PASS)");
        }

        let lastAuthError: unknown = null;

        for (const credentials of this.config.credentials) {
            try {
                const transporter = nodemailer.createTransport({
                    host: this.config.host,
                    port: this.config.port,
                    secure: this.config.secure,
                    auth: { user: credentials.user, pass: credentials.pass },
                });

                await transporter.verify();

                const info = await transporter.sendMail({
                    from: buildFromHeader(resolveFromEmail(this.config.fromEmail, credentials)),
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
            } catch (error) {
                if (isSmtpAuthError(error)) {
                    lastAuthError = error;
                    continue;
                }

                throw mapSmtpSendError(error, this.config.credentials.length);
            }
        }

        if (process.env.NODE_ENV !== "production" && isTestFallbackEnabled()) {
            console.warn(
                "SMTP authentication failed for all configured credentials; falling back to Ethereal in non-production.",
            );
            return new EtherealMailAdapter().send(options);
        }

        throw mapAllAuthAttemptsFailed(lastAuthError, this.config.credentials.length);
    }
}

/**
 * Ethereal (test) fallback adapter.
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
