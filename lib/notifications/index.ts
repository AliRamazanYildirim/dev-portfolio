/**
 * Notifications Module – Barrel Export & Factory
 *
 * Einzelner Einstiegspunkt für Notification-Ports.
 * Die Auswahl des konkreten Adapters (Mail, Push, etc.) erfolgt hier (DIP).
 */

export type {
    IDiscountNotifier,
    IReferralNotifier,
    IWelcomeNotifier,
    DiscountNotificationPayload,
    ReferralNotificationPayload,
    WelcomeNotificationPayload,
} from "./types";

export {
    MailDiscountNotifier,
    MailReferralNotifier,
    MailWelcomeNotifier,
} from "./mail-adapter";

import type { IDiscountNotifier, IReferralNotifier, IWelcomeNotifier } from "./types";
import { MailDiscountNotifier, MailReferralNotifier, MailWelcomeNotifier } from "./mail-adapter";

/* ---------- Singleton Instances ---------- */

let _discountNotifier: IDiscountNotifier | null = null;
let _referralNotifier: IReferralNotifier | null = null;
let _welcomeNotifier: IWelcomeNotifier | null = null;

export function getDiscountNotifier(): IDiscountNotifier {
    if (!_discountNotifier) _discountNotifier = new MailDiscountNotifier();
    return _discountNotifier;
}

export function getReferralNotifier(): IReferralNotifier {
    if (!_referralNotifier) _referralNotifier = new MailReferralNotifier();
    return _referralNotifier;
}

export function getWelcomeNotifier(): IWelcomeNotifier {
    if (!_welcomeNotifier) _welcomeNotifier = new MailWelcomeNotifier();
    return _welcomeNotifier;
}

/* ---------- Test Overrides ---------- */

export function setDiscountNotifier(notifier: IDiscountNotifier): void {
    _discountNotifier = notifier;
}

export function setReferralNotifier(notifier: IReferralNotifier): void {
    _referralNotifier = notifier;
}

export function setWelcomeNotifier(notifier: IWelcomeNotifier): void {
    _welcomeNotifier = notifier;
}
