/**
 * Discount Email Service – SOLID-Refactored v2 (SRP + OCP + DIP).
 *
 * v2 değişiklikleri:
 *  - Domain kuralları discountPolicy modülüne taşındı (OCP)
 *  - Template oluşturma IEmailTemplateBuilder port'una delege edildi (DIP)
 *  - Transaction güncelleme hesaplaması saf fonksiyona ayrıldı (SRP)
 *  - sendEmail/resetEmail ayrı UseCase sınıflarına bölündü (SRP)
 *  - Facade geriye uyumluluk için korunuyor
 *
 * Route handlers must NOT access Models directly.
 */

import { customerRepository, referralRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { getDiscountNotifier } from "@/lib/notifications";
import { ValidationError, NotFoundError, ConflictError } from "@/lib/errors";
import { toCustomerReadDto, type CustomerReadDto } from "@/app/api/admin/customers/lib/dto";
import {
    isValidRate,
    isBonusRate as checkIsBonusRate,
    assertBonusEligible,
    assertEmailNotSent,
    buildStandardEmailContent,
    buildBonusEmailContent,
    computeTransactionUpdate,
    computeReferrerUpdate,
    type DiscountRateInput,
    type EmailContent,
} from "./lib/discountPolicy";
import { getEmailTemplateBuilder } from "./lib/templateAdapter";

/* ================================================================
 * DATA ACCESS – Laden & Validieren (SRP)
 * ================================================================ */

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

/* ================================================================
 * SEND USE-CASE (SRP: sadece gönderim orkestresyonu)
 * ================================================================ */

export interface SendEmailResult {
    transactionId: string;
    emailSent: boolean;
    discountRate: number | "+3";
    referrerEmail: string;
    isBonus: boolean;
}

export class DiscountSendEmailUseCase {
    /**
     * Discount-E-Mail senden – ince orkestrasyon, sıfır iş mantığı.
     * Kurallar → discountPolicy, Şablonlar → templateAdapter (DIP).
     */
    static async execute(transactionId: string, discountRate: unknown): Promise<SendEmailResult> {
        if (!transactionId) throw new ValidationError("Transaction ID is required");
        if (!isValidRate(discountRate)) throw new ValidationError("Discount rate must be 3, 6, 9, or '+3' (bonus)");

        const isBonus = checkIsBonusRate(discountRate);
        await connectToMongo();

        // 1. Veri yükle & eligibility kontrol (policy kuralları)
        const transaction = await loadValidatedTransaction(transactionId);
        assertEmailNotSent(transaction.emailSent);

        const referrer = await loadValidatedReferrer(transaction.referrerCode);
        if (isBonus) assertBonusEligible(referrer.referralCount);

        // 2. E-Mail içeriği oluştur (strategy + template port → DIP)
        const templateBuilder = getEmailTemplateBuilder();
        const emailContent: EmailContent = isBonus
            ? buildBonusEmailContent(referrer, templateBuilder)
            : buildStandardEmailContent(referrer, discountRate as number, templateBuilder);

        // 3. Referrer güncelle (saf hesaplama → persist)
        const referrerUpdate = computeReferrerUpdate(isBonus, discountRate, emailContent.finalNewPrice);
        await customerRepository.update({
            where: { id: referrer.id },
            data: referrerUpdate,
        });

        // 4. Notification port ile gönder (DIP)
        const notifier = getDiscountNotifier();
        await notifier.notifyReferrer({
            to: referrer.email,
            subject: emailContent.subject,
            html: emailContent.html,
        });

        // 5. Transaction güncelle (saf hesaplama → persist)
        const txUpdate = computeTransactionUpdate(
            transaction, isBonus, discountRate, referrer.referralCount, emailContent,
        );
        await referralRepository.update({
            where: { id: transactionId },
            data: txUpdate as unknown as Record<string, unknown>,
        });

        return {
            transactionId,
            emailSent: true,
            discountRate: emailContent.actualDiscountRate,
            referrerEmail: referrer.email,
            isBonus,
        };
    }
}

/* ================================================================
 * RESET USE-CASE (SRP: sadece sıfırlama orkestresyonu)
 * ================================================================ */

export interface ResetEmailResult {
    transactionId: string;
    emailSent: boolean;
    correctionEmailSent: boolean;
    referrerEmail: string;
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
