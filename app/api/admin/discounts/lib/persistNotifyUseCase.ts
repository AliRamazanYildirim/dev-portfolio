/**
 * Discount Persist-Notify Use-Case – Phase 3: Seiteneffekte (SRP).
 *
 * Nimmt ein vollständig berechnetes Ergebnis und führt
 * die DB-Updates und den E-Mail-Versand aus.
 * Enthält KEINE Geschäftslogik – nur I/O-Orchestrierung.
 *
 * v2: Idempotent/transactional – Schritte:
 *   1. Idempotency-Guard: Transaction sofort als emailSent=true markieren
 *      → verhindert doppelte Anwendung bei Retry
 *   2. Referrer-Preis DB-Update
 *   3. E-Mail-Versand über Notification-Port
 *   4. Transaction-Metadaten finalisieren
 *   Bei Fehler in Schritt 2-4: Rollback von Schritt 1 (emailSent=false)
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
     *
     * Idempotency-Strategie:
     *   - Die Transaction wird **zuerst** als `emailSent = true` markiert
     *     (Idempotency-Guard). Dadurch wird bei einem Retry vor allen
     *     Seiteneffekten erkannt, dass der Vorgang bereits läuft.
     *   - Falls ein nachfolgender Schritt fehlschlägt, wird der Guard
     *     per Rollback zurückgesetzt (`emailSent = false`), damit ein
     *     erneuter Aufruf sicher möglich ist.
     *   - Bonus-Discount wird NICHT doppelt angewendet, weil die
     *     Validate-Phase `checkEmailStatus` **vor** diesem Use-Case prüft.
     */
    static async execute(
        ctx: ComputedDiscountContext,
        notifier: IDiscountNotifier,
    ): Promise<PersistNotifyResult> {
        // ── Step 1: Idempotency-Guard setzen ──────────────────────
        // markiert die Transaction sofort als "in Bearbeitung".
        // Ein paralleler/Retry-Aufruf wird von checkEmailStatus abgelehnt.
        await referralRepository.update({
            where: { id: ctx.transactionId },
            data: { emailSent: true },
        });

        try {
            // ── Step 2: Referrer-Preis in DB aktualisieren ────────
            await customerRepository.update({
                where: { id: ctx.referrer.id },
                data: ctx.referrerUpdate,
            });

            // ── Step 3: E-Mail über Notification-Port senden (DIP)
            await notifier.notifyReferrer({
                to: ctx.referrer.email,
                subject: ctx.emailContent.subject,
                html: ctx.emailContent.html,
            });

            // ── Step 4: Transaction-Metadaten finalisieren ────────
            await referralRepository.update({
                where: { id: ctx.transactionId },
                data: ctx.transactionUpdate,
            });
        } catch (err) {
            // ── Rollback: Guard zurücksetzen ──────────────────────
            // Setzt emailSent zurück, damit die Transaction bei einem
            // bewussten Retry erneut verarbeitet werden kann.
            await referralRepository.update({
                where: { id: ctx.transactionId },
                data: { emailSent: false },
            }).catch(() => {
                // Rollback-Fehler loggen, aber Original-Error weiterwerfen
                console.error(
                    `[PersistNotify] Rollback failed for transaction ${ctx.transactionId}`,
                );
            });
            throw err;
        }

        return {
            transactionId: ctx.transactionId,
            emailSent: true,
            discountRate: ctx.emailContent.actualDiscountRate,
            referrerEmail: ctx.referrer.email,
            isBonus: ctx.isBonus,
        };
    }
}
