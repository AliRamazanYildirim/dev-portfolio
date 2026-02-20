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
import { getDependencies } from "@/lib/composition-root";

/** Explicit override (für Abwärtskompatibilität & direkte Test-Overrides) */
let _override: IMailPort | null = null;

/**
 * Returns the shared mail port instance.
 * Priority: explicit override → composition root.
 */
export function getMailPort(): IMailPort {
    if (_override) return _override;
    return getDependencies().mail;
}

/**
 * Override the mail port (e.g. for testing with a mock).
 * @deprecated Prefer initDependencies() from composition-root instead.
 */
export function setMailPort(port: IMailPort): void {
    _override = port;
}
