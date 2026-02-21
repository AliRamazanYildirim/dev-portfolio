/**
 * Mail Module – Barrel Export & Factory
 *
 * Einzelner Einstiegspunkt: Alle Domain-Services greifen über dieses Modul
 * auf den Mail-Port zu. Die Auswahl des konkreten Adapters erfolgt über
 * die Composition Root (DIP).
 *
 * v3: Lokaler Override-State entfernt.
 *     Einziger Wiring-Punkt ist jetzt initDependencies() in composition-root.
 */

export type { IMailPort, SendMailOptions, SendMailResult, MailAttachment } from "./types";
export { SmtpMailAdapter, EtherealMailAdapter } from "./smtp-adapter";

import type { IMailPort } from "./types";
import { getDependencies } from "@/lib/composition-root";

/**
 * Returns the shared mail port instance from Composition Root.
 */
export function getMailPort(): IMailPort {
    return getDependencies().mail;
}
