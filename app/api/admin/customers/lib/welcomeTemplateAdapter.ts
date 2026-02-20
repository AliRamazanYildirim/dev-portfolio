/**
 * Welcome Template Port – DIP: Template detaylarını domain'den ayırır.
 *
 * WelcomeEmailService bu interface'e bağımlıdır,
 * somut buildWelcomeEmailHTML fonksiyonuna değil.
 */

import { buildWelcomeEmailHTML } from "./email-templates";

/* ================================================================
 * PORT
 * ================================================================ */

export interface IWelcomeTemplateBuilder {
    buildWelcomeEmail(params: {
        firstName: string;
        lastName: string;
        language?: string;
    }): { html: string; subject: string };
}

/* ================================================================
 * CONCRETE ADAPTER
 * ================================================================ */

export class DefaultWelcomeTemplateBuilder implements IWelcomeTemplateBuilder {
    buildWelcomeEmail(params: Parameters<IWelcomeTemplateBuilder["buildWelcomeEmail"]>[0]) {
        return buildWelcomeEmailHTML(params);
    }
}

/* ---------- Singleton + Override → Composition Root ---------- */

let _override: IWelcomeTemplateBuilder | null = null;

export function getWelcomeTemplateBuilder(): IWelcomeTemplateBuilder {
    if (_override) return _override;
    const { getDependencies } = require("@/lib/composition-root") as typeof import("@/lib/composition-root");
    return getDependencies().templates.welcomeEmail;
}

/** @deprecated Prefer initDependencies() from composition-root instead. */
export function setWelcomeTemplateBuilder(builder: IWelcomeTemplateBuilder): void {
    _override = builder;
}
