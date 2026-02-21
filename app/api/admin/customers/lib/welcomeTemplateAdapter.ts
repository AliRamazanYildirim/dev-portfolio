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

/* ---------- Singleton → Composition Root ---------- */

export function getWelcomeTemplateBuilder(): IWelcomeTemplateBuilder {
    return new DefaultWelcomeTemplateBuilder();
}
