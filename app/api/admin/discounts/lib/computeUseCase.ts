/**
 * Discount Compute Use-Case – Phase 2: Berechnung ohne Seiteneffekte (SRP).
 *
 * Nimmt einen validierten Kontext und erzeugt alle benötigten
 * Update-Daten und E-Mail-Inhalte. Reine Funktionen, kein I/O.
 */

import type { CustomerReadDto } from "@/app/api/admin/customers/lib/dto";
import {
    buildStandardEmailContent,
    buildBonusEmailContent,
    computeTransactionUpdate,
    computeReferrerUpdate,
    type DiscountRateInput,
    type EmailContent,
    type TransactionUpdateData,
    type ReferrerUpdateData,
} from "./discountPolicy";
import type { IEmailTemplateBuilder } from "./discountPolicy";
import type { ValidatedDiscountContext } from "./validateUseCase";

/* ================================================================
 * TYPES
 * ================================================================ */

/** Vollständig berechneter Kontext – bereit für Persist-Phase. */
export interface ComputedDiscountContext {
    transactionId: string;
    referrer: CustomerReadDto;
    isBonus: boolean;
    emailContent: EmailContent;
    referrerUpdate: ReferrerUpdateData;
    transactionUpdate: TransactionUpdateData;
}

/* ================================================================
 * USE-CASE
 * ================================================================ */

export class ComputeDiscountUseCase {
    /**
     * Berechnet E-Mail-Inhalt, Referrer-Update und Transaction-Update.
     * Erzeugt KEINE Seiteneffekte – die Ergebnisse werden
     * der Persist-Phase übergeben.
     */
    static execute(
        ctx: ValidatedDiscountContext,
        templateBuilder: IEmailTemplateBuilder,
    ): ComputedDiscountContext {
        // 1. E-Mail-Inhalt erzeugen (Strategy Pattern via Policy)
        const emailContent: EmailContent = ctx.isBonus
            ? buildBonusEmailContent(ctx.referrer, templateBuilder)
            : buildStandardEmailContent(
                ctx.referrer,
                ctx.discountRate as number,
                templateBuilder,
            );

        // 2. Referrer-Update berechnen (pure)
        const referrerUpdate = computeReferrerUpdate(
            ctx.isBonus,
            ctx.discountRate,
            emailContent.finalNewPrice,
        );

        // 3. Transaction-Update berechnen (pure)
        const transactionUpdate = computeTransactionUpdate(
            ctx.transaction,
            ctx.isBonus,
            ctx.discountRate,
            ctx.referrer.referralCount,
            emailContent,
        );

        return {
            transactionId: ctx.transactionId,
            referrer: ctx.referrer,
            isBonus: ctx.isBonus,
            emailContent,
            referrerUpdate,
            transactionUpdate,
        };
    }
}
