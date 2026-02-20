/**
 * Notification Ports – Domain-Level Abstraktionen für Benachrichtigungen (DIP).
 *
 * Domain-Services hängen von diesen Interfaces ab,
 * nicht von konkreten E-Mail-Templates oder Transport-Details.
 * Jeder Port ist schlank und zweckgebunden (ISP).
 */

/* ---------- Discount Notification ---------- */

export interface DiscountNotificationPayload {
    to: string;
    subject: string;
    html: string;
}

export interface IDiscountNotifier {
    notifyReferrer(payload: DiscountNotificationPayload): Promise<void>;
    notifyCorrection(payload: DiscountNotificationPayload): Promise<void>;
}

/* ---------- Referral Notification ---------- */

export interface ReferralNotificationPayload {
    to: string;
    subject: string;
    html: string;
}

export interface IReferralNotifier {
    sendReferralInfo(payload: ReferralNotificationPayload): Promise<void>;
}

/* ---------- Welcome Notification ---------- */

export interface WelcomeNotificationPayload {
    to: string;
    subject: string;
    html: string;
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: Buffer | string;
        contentType?: string;
    }>;
}

export interface IWelcomeNotifier {
    sendWelcome(payload: WelcomeNotificationPayload): Promise<void>;
}
