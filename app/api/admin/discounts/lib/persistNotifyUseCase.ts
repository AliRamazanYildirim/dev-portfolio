/**
 * Discount Persist-Notify Use-Case – Phase 3: Seiteneffekte (SRP).
 *
 * Nimmt ein vollständig berechnetes Ergebnis und führt
 * die DB-Updates und den E-Mail-Versand aus.
 * Enthält KEINE Geschäftslogik – nur I/O-Orchestrierung.
 */

import { customerRepository, referralRepository } from "@/lib/repositories";
import type { IDiscountNotifier } from "@/lib/notifications/types";
import type { ComputedDiscountContext } from "./computeUseCase";

/* ================================================================
 * TYPES
 * ================================================================ */

export interface PersistNotifyResult {
    transactionId: string;
    emailSent: boolean;
    discountRate: number | "+3";
    referrerEmail: string;
    isBonus: boolean;
}

/* ================================================================
 * USE-CASE
 * ================================================================ */

export class PersistNotifyDiscountUseCase {
    /**
     * Persistiert die berechneten Daten und sendet die Benachrichtigung.
     * Reihenfolge: Referrer update → Notification → Transaction update.
     */
    static async execute(
        ctx: ComputedDiscountContext,
        notifier: IDiscountNotifier,
    ): Promise<PersistNotifyResult> {
        // 1. Referrer-Preis in DB aktualisieren
        await customerRepository.update({
            where: { id: ctx.referrer.id },
            data: ctx.referrerUpdate,
        });

        // 2. E-Mail über Notification-Port senden (DIP)
        await notifier.notifyReferrer({
            to: ctx.referrer.email,
            subject: ctx.emailContent.subject,
            html: ctx.emailContent.html,
        });

        // 3. Transaction als gesendet markieren
        await referralRepository.update({
            where: { id: ctx.transactionId },
            data: ctx.transactionUpdate as Record<string, unknown>,
        });

        return {
            transactionId: ctx.transactionId,
            emailSent: true,
            discountRate: ctx.emailContent.actualDiscountRate,
            referrerEmail: ctx.referrer.email,
            isBonus: ctx.isBonus,
        };
    }
}
