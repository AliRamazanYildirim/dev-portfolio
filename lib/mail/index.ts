/**
 * Mail Module – Barrel Export & Factory
 *
 * Einzelner Einstiegspunkt: Alle Domain-Services greifen über dieses Modul  
 * auf den Mail-Port zu. Die Auswahl des konkreten Adapters erfolgt hier (DIP).
 */

export type { IMailPort, SendMailOptions, SendMailResult, MailAttachment } from "./types";
export { SmtpMailAdapter, EtherealMailAdapter } from "./smtp-adapter";

import type { IMailPort } from "./types";
import { SmtpMailAdapter, EtherealMailAdapter } from "./smtp-adapter";

/** Singleton mail port instance */
let _mailPort: IMailPort | null = null;

/**
 * Returns the shared mail port instance.
 * Uses SmtpMailAdapter when credentials exist, falls back to Ethereal otherwise.
 */
export function getMailPort(): IMailPort {
    if (!_mailPort) {
        const hasCredentials = Boolean(
            (process.env.SMTP_USER || process.env.EMAIL_USER) &&
            (process.env.SMTP_PASS || process.env.EMAIL_PASS),
        );
        _mailPort = hasCredentials ? new SmtpMailAdapter() : new EtherealMailAdapter();
    }
    return _mailPort;
}

/**
 * Override the mail port (e.g. for testing with a mock).
 */
export function setMailPort(port: IMailPort): void {
    _mailPort = port;
}
