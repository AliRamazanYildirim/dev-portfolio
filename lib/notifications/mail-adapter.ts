/**
 * Mail-basierter Notification Adapter – Implementiert alle Notification Ports via IMailPort.
 *
 * Koppelt die Domain-Level Notification-Abstraktionen an den konkreten Mail-Transport.
 * Domain-Services nutzen die Ports (DIP), dieser Adapter verbindet sie mit dem Mail-System.
 */

import { getMailPort } from "@/lib/mail";
import type {
    IDiscountNotifier,
    DiscountNotificationPayload,
    IReferralNotifier,
    ReferralNotificationPayload,
    IWelcomeNotifier,
    WelcomeNotificationPayload,
} from "./types";

export class MailDiscountNotifier implements IDiscountNotifier {
    async notifyReferrer(payload: DiscountNotificationPayload): Promise<void> {
        const mailPort = getMailPort();
        await mailPort.send({
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
        });
    }

    async notifyCorrection(payload: DiscountNotificationPayload): Promise<void> {
        const mailPort = getMailPort();
        await mailPort.send({
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
        });
    }
}

export class MailReferralNotifier implements IReferralNotifier {
    async sendReferralInfo(payload: ReferralNotificationPayload): Promise<void> {
        const mailPort = getMailPort();
        await mailPort.send({
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
        });
    }
}

export class MailWelcomeNotifier implements IWelcomeNotifier {
    async sendWelcome(payload: WelcomeNotificationPayload): Promise<void> {
        const mailPort = getMailPort();
        await mailPort.send({
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            attachments: payload.attachments,
        });
    }
}
