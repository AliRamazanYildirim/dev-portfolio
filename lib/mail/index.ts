/**
 * Mail Module – Barrel Export & Factory
 *
 * Einzelner Einstiegspunkt: Alle Domain-Services greifen über dieses Modul  
 * auf den Mail-Port zu. Die Auswahl des konkreten Adapters erfolgt hier (DIP).
 *
 * v2: Delegiert an Composition Root, behält die bisherige API bei.
 */

export type { IMailPort, SendMailOptions, SendMailResult, MailAttachment } from "./types";
export { SmtpMailAdapter, EtherealMailAdapter } from "./smtp-adapter";

import type { IMailPort } from "./types";

/** Explicit override (für Abwärtskompatibilität & direkte Test-Overrides) */
let _override: IMailPort | null = null;

/**
 * Returns the shared mail port instance.
 * Priority: explicit override → composition root → auto-detect.
 */
export function getMailPort(): IMailPort {
    if (_override) return _override;

    // Lazy delegation to composition root
    try {
        const { getDependencies } = require("@/lib/composition-root");
        return getDependencies().mail;
    } catch {
        // Fallback wenn Composition Root nicht verfügbar
        const { SmtpMailAdapter, EtherealMailAdapter } = require("./smtp-adapter");
        const hasCredentials = Boolean(
            (process.env.SMTP_USER || process.env.EMAIL_USER) &&
            (process.env.SMTP_PASS || process.env.EMAIL_PASS),
        );
        return hasCredentials ? new SmtpMailAdapter() : new EtherealMailAdapter();
    }
}

/**
 * Override the mail port (e.g. for testing with a mock).
 * @deprecated Prefer initDependencies() from composition-root instead.
 */
export function setMailPort(port: IMailPort): void {
    _override = port;
}
