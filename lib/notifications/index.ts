/**
 * Notifications Module – Barrel Export & Factory
 *
 * Einzelner Einstiegspunkt für Notification-Ports.
 * Die Auswahl des konkreten Adapters (Mail, Push, etc.) erfolgt hier (DIP).
 *
 * v2: Delegiert an Composition Root, behält die bisherige API bei.
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

/* ---------- Explicit Overrides (Abwärtskompatibilität) ---------- */

let _discountOverride: IDiscountNotifier | null = null;
let _referralOverride: IReferralNotifier | null = null;
let _welcomeOverride: IWelcomeNotifier | null = null;

function resolveFromRoot<K extends keyof import("@/lib/composition-root").AppDependencies["notifications"]>(
    key: K,
): import("@/lib/composition-root").AppDependencies["notifications"][K] {
    return getDependencies().notifications[key];
}

export function getDiscountNotifier(): IDiscountNotifier {
    return _discountOverride ?? resolveFromRoot("discount");
}

export function getReferralNotifier(): IReferralNotifier {
    return _referralOverride ?? resolveFromRoot("referral");
}

export function getWelcomeNotifier(): IWelcomeNotifier {
    return _welcomeOverride ?? resolveFromRoot("welcome");
}

/* ---------- Test Overrides ---------- */

/** @deprecated Prefer initDependencies() from composition-root instead. */
export function setDiscountNotifier(notifier: IDiscountNotifier): void {
    _discountOverride = notifier;
}

/** @deprecated Prefer initDependencies() from composition-root instead. */
export function setReferralNotifier(notifier: IReferralNotifier): void {
    _referralOverride = notifier;
}

/** @deprecated Prefer initDependencies() from composition-root instead. */
export function setWelcomeNotifier(notifier: IWelcomeNotifier): void {
    _welcomeOverride = notifier;
}
