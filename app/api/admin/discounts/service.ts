/**
 * Rabatt-E-Mail-Dienst – SOLID-Refactored v3 (SRP + OCP + DIP).
 *
 * Änderungen in v3:
 *  - Der Send-Flow wurde in 3 unabhängige Use-Cases aufgeteilt: validate → compute → persist-notify (SRP)
 *  - Jeder Use-Case hat eine einzige Verantwortung, ist unabhängig testbar
 *  - Abhängigkeiten werden explizit über DI injiziert (DIP)
 *  - Der Reset-Flow wird als separater Use-Case beibehalten (SRP)
 *  - Die Fassade wird zur Rückwärtskompatibilität beibehalten
 *
 * Routen-Handler dürfen nicht direkt auf Modelle zugreifen.
 */

import { customerRepository, referralRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { getDiscountNotifier } from "@/lib/notifications";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { toCustomerReadDto, type CustomerReadDto } from "@/app/api/admin/customers/lib/dto";
import type { IReferralTransaction } from "@/models/ReferralTransaction";
import { ValidateDiscountUseCase } from "./lib/validateUseCase";
import { ComputeDiscountUseCase } from "./lib/computeUseCase";
import { PersistNotifyDiscountUseCase, type PersistNotifyResult } from "./lib/persistNotifyUseCase";
import { getEmailTemplateBuilder } from "./lib/templateAdapter";

/* ================================================================
 * SEND PIPELINE – 3-Phase Orchestrierung (SRP)
 * ================================================================ */

export type SendEmailResult = PersistNotifyResult;

export class DiscountSendEmailUseCase {
    /**
     * Discount-E-Mail senden – 3-Phasen-Pipeline:
     *   1. validate: Daten laden & Regeln prüfen (keine Seiteneffekte)
     *   2. compute:  E-Mail & Update-Daten berechnen (pure)
     *   3. persist:  DB updaten & Notification senden (I/O)
     */
    static async execute(transactionId: string, discountRate: unknown): Promise<SendEmailResult> {
        // Phase 1: Validate (Daten laden, Eligibility prüfen)
        const validated = await ValidateDiscountUseCase.execute(transactionId, discountRate);

        // Phase 2: Compute (E-Mail-Inhalt & Updates berechnen – pure)
        const templateBuilder = getEmailTemplateBuilder();
        const computed = ComputeDiscountUseCase.execute(validated, templateBuilder);

        // Phase 3: Persist + Notify (DB-Updates & Mail-Versand)
        const notifier = getDiscountNotifier();
        return PersistNotifyDiscountUseCase.execute(computed, notifier);
    }
}

/* ================================================================
 * RESET USE-CASE (SRP: nur Reset-Orchestrierung)
 * ================================================================ */

export interface ResetEmailResult {
    transactionId: string;
    emailSent: boolean;
    correctionEmailSent: boolean;
    referrerEmail: string;
}

async function loadValidatedTransaction(transactionId: string): Promise<IReferralTransaction> {
    const transaction = await referralRepository.findById(transactionId);
    if (!transaction) throw new NotFoundError("Transaction not found");
    return transaction;
}

async function loadValidatedReferrer(referrerCode: string): Promise<CustomerReadDto> {
    const referrerRaw = await customerRepository.findOneExec({
        myReferralCode: referrerCode,
    });

    if (!referrerRaw) throw new NotFoundError("Referrer not found");

    const referrer = toCustomerReadDto(referrerRaw);
    if (!referrer.email) throw new ValidationError("Referrer has no email address");

    return referrer;
}

export class DiscountResetEmailUseCase {
    /**
     * Reset discount email – fine orchestration.
     */
    static async execute(transactionId: string, sendCorrectionEmail = true): Promise<ResetEmailResult> {
        if (!transactionId) throw new ValidationError("Transaction ID is required");
        await connectToMongo();

        // 1. Veri yükle & validasyon
        const transaction = await loadValidatedTransaction(transactionId);
        if (!transaction.emailSent) {
            throw new ValidationError("Email was not sent for this transaction, nothing to reset");
        }

        const referrer = await loadValidatedReferrer(transaction.referrerCode);

        // 2. Send correction email (optional – template Port DIP)
        if (sendCorrectionEmail && referrer.email) {
            const templateBuilder = getEmailTemplateBuilder();
            const { html, subject } = templateBuilder.buildCorrectionEmail({
                refFirst: referrer.firstname,
                refLast: referrer.lastname,
                myReferralCode: referrer.myReferralCode ?? "",
                originalDiscountRate: transaction.discountRate,
                originalAmount: Math.max(
                    transaction.originalPrice - transaction.finalPrice,
                    0,
                ),
            });

            const notifier = getDiscountNotifier();
            await notifier.notifyCorrection({ to: referrer.email, subject, html });
        }

        // 3. Transaction Reset
        await referralRepository.update({
            where: { id: transactionId },
            data: { emailSent: false, isBonus: false },
        });

        return {
            transactionId,
            emailSent: false,
            correctionEmailSent: sendCorrectionEmail && !!referrer.email,
            referrerEmail: referrer.email,
        };
    }
}

/* ================================================================
 * FACADE – Backward-compatible adapter
 * ================================================================ */

export class DiscountEmailService {
    static sendEmail = (transactionId: string, discountRate: unknown) =>
        DiscountSendEmailUseCase.execute(transactionId, discountRate);

    static resetEmail = (transactionId: string, sendCorrectionEmail = true) =>
        DiscountResetEmailUseCase.execute(transactionId, sendCorrectionEmail);
}
