/**
 * Composition Root – Zentrale Dependency-Verdrahtung (DIP).
 *
 * Alle konkreten Adapter werden hier einmalig erzeugt und als
 * typisierte Dependencies bereitgestellt. Services erhalten ihre
 * Abhängigkeiten über dieses Modul statt über Singleton set/get.
 *
 * Vorteile:
 *  - Explizite Wiring: Alle Abhängigkeiten sichtbar an einem Ort
 *  - Test-Isolation: resolveDependencies() kann mit Mocks aufgerufen werden
 *  - Kein globaler Mutable State (kein set*-Antipattern)
 *
 * Bestehende set/get-Singleton-APIs bleiben für Abwärtskompatibilität
 * erhalten, delegieren aber an die Composition Root.
 */

import type { IMailPort } from "@/lib/mail/types";
import type { IDiscountNotifier, IReferralNotifier, IWelcomeNotifier } from "@/lib/notifications/types";
import type { IEmailTemplateBuilder } from "@/app/api/admin/discounts/lib/discountPolicy";
import type { ICorrectionTemplateBuilder } from "@/app/api/admin/discounts/lib/templateAdapter";
import type { IWelcomeTemplateBuilder } from "@/app/api/admin/customers/lib/welcomeTemplateAdapter";
import type { IInvoiceTemplateBuilder } from "@/app/api/invoice/send-email/lib/templateAdapter";

/* ================================================================
 * DEPENDENCY CONTAINER TYPE
 * ================================================================ */

export interface AppDependencies {
    /** E-Mail-Transport (SMTP, SES, Mock) */
    mail: IMailPort;

    /** Notification Ports */
    notifications: {
        discount: IDiscountNotifier;
        referral: IReferralNotifier;
        welcome: IWelcomeNotifier;
    };

    /** Template Builder Ports */
    templates: {
        discountEmail: IEmailTemplateBuilder & ICorrectionTemplateBuilder;
        welcomeEmail: IWelcomeTemplateBuilder;
        invoiceEmail: IInvoiceTemplateBuilder;
    };
}

/** Partielle Overrides für Tests / spezielle Umgebungen */
export type DependencyOverrides = {
    [K in keyof AppDependencies]?: K extends "notifications"
    ? Partial<AppDependencies["notifications"]>
    : K extends "templates"
    ? Partial<AppDependencies["templates"]>
    : AppDependencies[K];
};

/* ================================================================
 * LAZY PRODUCTION DEFAULTS
 * ================================================================ */

function createProductionDependencies(): AppDependencies {
    // Lazy imports – erst bei Aufruf, nicht bei Modul-Load
    const { SmtpMailAdapter, EtherealMailAdapter } = require("@/lib/mail/smtp-adapter");
    const { MailDiscountNotifier, MailReferralNotifier, MailWelcomeNotifier } = require("@/lib/notifications/mail-adapter");
    const { DefaultEmailTemplateBuilder } = require("@/app/api/admin/discounts/lib/templateAdapter");
    const { DefaultWelcomeTemplateBuilder } = require("@/app/api/admin/customers/lib/welcomeTemplateAdapter");
    const { DefaultInvoiceTemplateBuilder } = require("@/app/api/invoice/send-email/lib/templateAdapter");

    const hasCredentials = Boolean(
        (process.env.SMTP_USER || process.env.EMAIL_USER) &&
        (process.env.SMTP_PASS || process.env.EMAIL_PASS),
    );

    return {
        mail: hasCredentials ? new SmtpMailAdapter() : new EtherealMailAdapter(),
        notifications: {
            discount: new MailDiscountNotifier(),
            referral: new MailReferralNotifier(),
            welcome: new MailWelcomeNotifier(),
        },
        templates: {
            discountEmail: new DefaultEmailTemplateBuilder(),
            welcomeEmail: new DefaultWelcomeTemplateBuilder(),
            invoiceEmail: new DefaultInvoiceTemplateBuilder(),
        },
    };
}

/* ================================================================
 * CONTAINER SINGLETON
 * ================================================================ */

let _deps: AppDependencies | null = null;

/**
 * Gibt den globalen Dependency-Container zurück.
 * Erstellt die Production-Defaults beim ersten Aufruf (lazy).
 */
export function getDependencies(): AppDependencies {
    if (!_deps) {
        _deps = createProductionDependencies();
    }
    return _deps;
}

/**
 * Initialisiert den Container mit optionalen Overrides.
 * Ideal für Tests: nur die benötigten Mocks übergeben.
 *
 * @example
 * // Test-Setup
 * initDependencies({
 *   mail: mockMailPort,
 *   notifications: { discount: mockDiscountNotifier },
 * });
 */
export function initDependencies(overrides: DependencyOverrides = {}): AppDependencies {
    const defaults = createProductionDependencies();

    _deps = {
        mail: overrides.mail ?? defaults.mail,
        notifications: {
            discount: overrides.notifications?.discount ?? defaults.notifications.discount,
            referral: overrides.notifications?.referral ?? defaults.notifications.referral,
            welcome: overrides.notifications?.welcome ?? defaults.notifications.welcome,
        },
        templates: {
            discountEmail: overrides.templates?.discountEmail ?? defaults.templates.discountEmail,
            welcomeEmail: overrides.templates?.welcomeEmail ?? defaults.templates.welcomeEmail,
            invoiceEmail: overrides.templates?.invoiceEmail ?? defaults.templates.invoiceEmail,
        },
    };

    return _deps;
}

/**
 * Setzt den Container zurück (für Test-Teardown).
 */
export function resetDependencies(): void {
    _deps = null;
}
