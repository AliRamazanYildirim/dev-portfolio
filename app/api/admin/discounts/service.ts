/**
 * Discount Email Service – SOLID-Refactored v3 (SRP + OCP + DIP).
 *
 * v3 değişiklikleri:
 *  - Send akışı 3 bağımsız use-case'e ayrıldı: validate → compute → persist-notify (SRP)
 *  - Her use-case tek bir sorumluluğa sahip, bağımsız test edilebilir
 *  - Bağımlılıklar explicit DI ile enjekte ediliyor (DIP)
 *  - Reset akışı ayrı use-case olarak korunuyor (SRP)
 *  - Facade geriye uyumluluk için korunuyor
 *
 * Route handlers must NOT access Models directly.
 */

import { customerRepository, referralRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { getDiscountNotifier } from "@/lib/notifications";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { toCustomerReadDto, type CustomerReadDto } from "@/app/api/admin/customers/lib/dto";
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

async function loadValidatedTransaction(transactionId: string) {
    const transaction = await referralRepository.findById(transactionId) as Record<string, unknown> | null;
    if (!transaction) throw new NotFoundError("Transaction not found");
    return transaction;
}

async function loadValidatedReferrer(referrerCode: unknown): Promise<CustomerReadDto> {
    const referrerRaw = await customerRepository.findOneExec({
        myReferralCode: referrerCode,
    }) as Record<string, unknown> | null;

    if (!referrerRaw) throw new NotFoundError("Referrer not found");

    const referrer = toCustomerReadDto(referrerRaw as Record<string, unknown>);
    if (!referrer.email) throw new ValidationError("Referrer has no email address");

    return referrer;
}

export class DiscountResetEmailUseCase {
    /**
     * Discount-E-Mail zurücksetzen (Reset) – ince orkestrasyon.
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

        // 2. Correction e-mail gönder (isteğe bağlı – template port DIP)
        if (sendCorrectionEmail && referrer.email) {
            const templateBuilder = getEmailTemplateBuilder();
            const { html, subject } = templateBuilder.buildCorrectionEmail({
                refFirst: referrer.firstname,
                refLast: referrer.lastname,
                myReferralCode: referrer.myReferralCode ?? "",
                originalDiscountRate: transaction.discountRate as number,
                originalAmount: Math.max(
                    (transaction.originalPrice as number) - (transaction.finalPrice as number),
                    0,
                ),
            });

            const notifier = getDiscountNotifier();
            await notifier.notifyCorrection({ to: referrer.email, subject, html });
        }

        // 3. Transaction sıfırla
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
 * FACADE – Geriye uyumlu adapter
 * ================================================================ */

export class DiscountEmailService {
    static sendEmail = (transactionId: string, discountRate: unknown) =>
        DiscountSendEmailUseCase.execute(transactionId, discountRate);

    static resetEmail = (transactionId: string, sendCorrectionEmail = true) =>
        DiscountResetEmailUseCase.execute(transactionId, sendCorrectionEmail);
}
