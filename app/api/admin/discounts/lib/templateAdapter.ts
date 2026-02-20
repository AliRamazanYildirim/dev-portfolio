/**
 * Discount Template Adapter – IEmailTemplateBuilder implementasyonu (DIP).
 *
 * Domain servisleri template detaylarını bilmez;
 * bu adapter, mevcut email-templates fonksiyonlarını IEmailTemplateBuilder port'una bağlar.
 */

import {
    buildReferrerEmailHTML,
    buildBonusEmailHTML,
    buildCorrectionEmailHTML,
} from "@/app/api/admin/customers/lib/email-templates";
import type { IEmailTemplateBuilder } from "./discountPolicy";

/* ================================================================
 * CORRECTION TEMPLATE PORT
 * ================================================================ */

export interface ICorrectionTemplateBuilder {
    buildCorrectionEmail(params: {
        refFirst: string;
        refLast: string;
        myReferralCode: string;
        originalDiscountRate: number;
        originalAmount: number;
    }): { html: string; subject: string };
}

/* ================================================================
 * CONCRETE ADAPTER
 * ================================================================ */

export class DefaultEmailTemplateBuilder implements IEmailTemplateBuilder, ICorrectionTemplateBuilder {
    buildReferrerEmail(params: Parameters<IEmailTemplateBuilder["buildReferrerEmail"]>[0]) {
        return buildReferrerEmailHTML(params);
    }

    buildBonusEmail(params: Parameters<IEmailTemplateBuilder["buildBonusEmail"]>[0]) {
        return buildBonusEmailHTML(params);
    }

    buildCorrectionEmail(params: Parameters<ICorrectionTemplateBuilder["buildCorrectionEmail"]>[0]) {
        return buildCorrectionEmailHTML(params);
    }
}

/* ---------- Singleton + Override → Composition Root ---------- */

let _override: (IEmailTemplateBuilder & ICorrectionTemplateBuilder) | null = null;

export function getEmailTemplateBuilder(): IEmailTemplateBuilder & ICorrectionTemplateBuilder {
    if (_override) return _override;
    try {
        const { getDependencies } = require("@/lib/composition-root");
        return getDependencies().templates.discountEmail;
    } catch {
        return new DefaultEmailTemplateBuilder();
    }
}

/** @deprecated Prefer initDependencies() from composition-root instead. */
export function setEmailTemplateBuilder(builder: IEmailTemplateBuilder & ICorrectionTemplateBuilder): void {
    _override = builder;
}
