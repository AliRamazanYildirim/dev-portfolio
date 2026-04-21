/**
 * Project Status Email API – Service Layer
 *
 * Orchestriert den Versand von Projekt-Status-E-Mails.
 * Route-Handler delegiert hierher – keine Geschäftslogik in route.ts.
 */

import {
    buildMailPayload,
    createProjectStatusTransporter,
    mapProjectStatusMailError,
} from "./lib/mailer";
import { buildBaseUrl } from "./lib/request";
import { buildLogoAttachment } from "./lib/logo";
import type { ProjectStatusPayload } from "./lib/types";

/* ================================================================
 * TYPES
 * ================================================================ */

export interface SendStatusEmailInput {
    payload: ProjectStatusPayload;
    request: Request;
}

export interface SendStatusEmailResult {
    sent: boolean;
}

/* ================================================================
 * SERVICE
 * ================================================================ */

export class ProjectStatusEmailService {
    /**
     * Baut die E-Mail zusammen und versendet sie.
     */
    static async send(input: SendStatusEmailInput): Promise<SendStatusEmailResult> {
        const { payload, request } = input;

        const { transporter, from } = createProjectStatusTransporter();
        const baseUrl = buildBaseUrl(request);
        const { attachments, logoCid } = buildLogoAttachment();

        const mailOptions = buildMailPayload({
            payload,
            baseUrl,
            from,
            attachments,
            logoCid,
        });

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            throw mapProjectStatusMailError(error);
        }

        return { sent: true };
    }
}
