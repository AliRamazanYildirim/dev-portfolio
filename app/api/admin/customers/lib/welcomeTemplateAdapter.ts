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

/* ---------- Singleton + Override ---------- */

let _builder: IWelcomeTemplateBuilder = new DefaultWelcomeTemplateBuilder();

export function getWelcomeTemplateBuilder(): IWelcomeTemplateBuilder {
    return _builder;
}

export function setWelcomeTemplateBuilder(builder: IWelcomeTemplateBuilder): void {
    _builder = builder;
}
