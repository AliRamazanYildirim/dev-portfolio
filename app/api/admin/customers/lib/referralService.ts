/**
 * Referral Service – Eigenständiger Service für Empfehlungs-Logik.
 *
 * Extrahiert aus CustomersService (SRP-Fix).
 * Verantwortlich für:
 *  - Referrer-Lookup & Rabattberechnung
 *  - Referrer-Update (referralCount, finalPrice, totalEarnings)
 *  - Referral-Transaction anlegen
 */

import { customerRepository, referralRepository } from "@/lib/repositories";
import { getDiscountsEnabled } from "@/lib/discountSettings";
import {
    calcDiscountedPrice,
    calcTotalEarnings,
} from "./referral";

export interface ReferralProcessResult {
    referrerCode: string | null;
    referrerDiscount: number;
    referrerOriginalPrice: number | null;
    referrerDiscountedPrice: number | null;
    emailSent: boolean;
    newReferralCount: number;
}

/**
 * Verarbeitet den Referral-Anteil einer Kunden-Erstellung oder -Aktualisierung.
 *
 * @param referralCode  Der vom Neukunden eingegebene Empfehlungscode
 * @param price         Preis des Neukunden
 * @param newCustomerId ID des (neuen/aktuellen) Kunden-Dokuments
 */
export async function processReferral(
    referralCode: string,
    price: number,
    newCustomerId: string,
): Promise<ReferralProcessResult> {
    const discountsEnabled = await getDiscountsEnabled();

    const referrer = await customerRepository.findUnique({
        where: { myReferralCode: referralCode },
    });

    if (!referrer || !referrer.price) {
        return {
            referrerCode: null,
            referrerDiscount: 0,
            referrerOriginalPrice: null,
            referrerDiscountedPrice: null,
            emailSent: false,
            newReferralCount: 0,
        };
    }

    const currentReferralCount = referrer.referralCount || 0;
    const newReferralCount = currentReferralCount + 1;

    const previousPrice = calcDiscountedPrice(referrer.price, currentReferralCount);
    const referrerFinalPrice = calcDiscountedPrice(referrer.price, newReferralCount);
    const referrerDiscount = Math.min(newReferralCount * 3, 9);

    const referrerUpdateData: Record<string, unknown> = {
        referralCount: newReferralCount,
        updatedAt: new Date(),
        totalEarnings: calcTotalEarnings(referrer.price, newReferralCount),
    };

    if (discountsEnabled) {
        referrerUpdateData.discountRate = referrerDiscount;
        referrerUpdateData.finalPrice = referrerFinalPrice;
    }

    try {
        await customerRepository.update({
            where: { id: String(referrer._id ?? (referrer as unknown as Record<string, unknown>).id) },
            data: referrerUpdateData,
        });
    } catch (updateErr) {
        console.error("Error updating referrer:", updateErr);
    }

    // Referral-Transaktion erstellen
    await referralRepository.create({
        data: {
            referrerCode: referrer.myReferralCode || referralCode,
            newCustomerId,
            discountRate: referrerDiscount,
            originalPrice: previousPrice,
            finalPrice: referrerFinalPrice,
            referralLevel: Math.ceil(referrerDiscount / 3),
            invoiceStatus: "pending",
            invoiceNumber: null,
            invoiceSentAt: null,
            emailSent: false,
        },
    });

    return {
        referrerCode: referrer.myReferralCode || null,
        referrerDiscount,
        referrerOriginalPrice: previousPrice,
        referrerDiscountedPrice: referrerFinalPrice,
        emailSent: false,
        newReferralCount,
    };
}
