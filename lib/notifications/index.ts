/**
 * Notifications Module – Barrel Export & Factory
 *
 * Einzelner Einstiegspunkt für Notification-Ports.
 * Die Auswahl des konkreten Adapters erfolgt über die Composition Root (DIP).
 *
 * v3: Lokaler Override-State entfernt.
 *     Einziger Wiring-Punkt ist jetzt initDependencies() in composition-root.
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
import { getDependencies } from "@/lib/composition-root";

/* ---------- Factory Functions (delegate to Composition Root) ---------- */

export function getDiscountNotifier(): IDiscountNotifier {
    return getDependencies().notifications.discount;
}

export function getReferralNotifier(): IReferralNotifier {
    return getDependencies().notifications.referral;
}

export function getWelcomeNotifier(): IWelcomeNotifier {
    return getDependencies().notifications.welcome;
}
