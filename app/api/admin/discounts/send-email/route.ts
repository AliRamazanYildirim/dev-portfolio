import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import { buildReferrerEmailHTML, buildBonusEmailHTML } from "@/app/api/admin/customers/lib/email-templates";
import { sendAdminEmail } from "@/app/api/admin/customers/lib/mailer";
import { calcDiscountedPrice } from "@/app/api/admin/customers/lib/referral";

const VALID_RATES = [3, 6, 9] as const;
type ValidRate = (typeof VALID_RATES)[number];

// "+3" is a special bonus rate for customers who already reached 9%
function isValidRate(rate: unknown): rate is ValidRate | "+3" {
    if (rate === "+3") return true;
    return typeof rate === "number" && VALID_RATES.includes(rate as ValidRate);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactionId, discountRate } = body;

        if (!transactionId) {
            return NextResponse.json(
                { success: false, error: "Transaction ID is required" },
                { status: 400 }
            );
        }

        if (!isValidRate(discountRate)) {
            return NextResponse.json(
                { success: false, error: "Discount rate must be 3, 6, 9, or '+3' (bonus)" },
                { status: 400 }
            );
        }

        const isBonusRate = discountRate === "+3";

        await connectToMongo();

        const transaction = await ReferralTransactionModel.findById(transactionId).exec();
        if (!transaction) {
            return NextResponse.json(
                { success: false, error: "Transaction not found" },
                { status: 404 }
            );
        }

        if (transaction.emailSent) {
            return NextResponse.json(
                { success: false, error: "Email already sent for this transaction" },
                { status: 409 }
            );
        }

        const referrer = await CustomerModel.findOne({
            myReferralCode: transaction.referrerCode,
        }).exec();

        if (!referrer) {
            return NextResponse.json(
                { success: false, error: "Referrer not found" },
                { status: 404 }
            );
        }

        if (!referrer.email) {
            return NextResponse.json(
                { success: false, error: "Referrer has no email address" },
                { status: 400 }
            );
        }

        const referrerPrice = referrer.price || 0;
        const referralCount = referrer.referralCount || 0;

        // For bonus rate, check if referrer has already reached 9% (3+ referrals)
        if (isBonusRate && referralCount < 3) {
            return NextResponse.json(
                { success: false, error: "Bonus rate (+3%) is only available for customers who reached 9% (3+ referrals)" },
                { status: 400 }
            );
        }

        let finalNewPrice: number;
        let actualDiscountRate: number | string;
        let emailHtml: string;
        let emailSubject: string;

        // We'll capture bonus-specific computed values so we can persist them
        // reliably into the transaction record below (defensive: avoid missing fields).
        let bonusOriginalPrice: number | null = null;
        let bonusFinalPrice: number | null = null;
        let bonusAmount: number | null = null;

        if (isBonusRate) {
            // Bonus: apply a 3% step on the referrer's current final price (iterative cents-rounded).
            // This ensures each bonus reduces the stored finalPrice further instead of staying at the 9% cap.
            const currentFinal = typeof referrer.finalPrice === "number" && !Number.isNaN(referrer.finalPrice)
                ? Number(referrer.finalPrice)
                : calcDiscountedPrice(referrerPrice, referralCount);

            const discountCents = Math.round(currentFinal * 0.03 * 100);
            const nextPrice = Math.round((currentFinal - discountCents / 100) * 100) / 100;
            const computedBonusAmount = Math.max(Math.round((currentFinal - nextPrice) * 100) / 100, 0);
            finalNewPrice = nextPrice;
            actualDiscountRate = "+3";

            // store computed bonus values to persist in transaction update later
            bonusOriginalPrice = currentFinal;
            bonusFinalPrice = nextPrice;
            bonusAmount = computedBonusAmount;

            const bonusEmail = buildBonusEmailHTML({
                refFirst: referrer.firstname ?? "",
                refLast: referrer.lastname ?? "",
                myReferralCode: referrer.myReferralCode ?? "",
                referralCount,
                previousFinalPrice: currentFinal,
                newFinalPrice: finalNewPrice,
                bonusAmount: computedBonusAmount,
            });
            emailHtml = bonusEmail.html;
            emailSubject = bonusEmail.subject;
        } else {
            // Standard discount rates (3, 6, 9)
            const referrerFinalPrice = calcDiscountedPrice(referrerPrice, referralCount);
            const previousPrice = referralCount > 1
                ? calcDiscountedPrice(referrerPrice, referralCount - 1)
                : referrerPrice;
            const currentDiscountAmount = previousPrice - referrerFinalPrice;
            finalNewPrice = referrerFinalPrice;
            actualDiscountRate = discountRate as number;

            const standardEmail = buildReferrerEmailHTML({
                refFirst: referrer.firstname ?? "",
                refLast: referrer.lastname ?? "",
                myReferralCode: referrer.myReferralCode ?? "",
                newCount: referralCount,
                discountRate: discountRate as number,
                referrerPrice,
                referrerFinalPrice,
                currentDiscountAmount,
                discountsEnabled: true,
            });
            emailHtml = standardEmail.html;
            emailSubject = standardEmail.subject;
        }

        // Referrer'ın finalPrice'ını güncelle (persist the new discounted price).
        await CustomerModel.findByIdAndUpdate(referrer._id, {
            discountRate: isBonusRate ? 9 : discountRate,
            finalPrice: finalNewPrice,
            updatedAt: new Date(),
        }).exec();

        await sendAdminEmail({
            to: referrer.email,
            subject: emailSubject,
            html: emailHtml,
        });

        // Transaction'ı emailSent=true ve isBonus olarak güncelle
        const newReferralLevel = isBonusRate
            ? (typeof transaction.referralLevel === "number"
                ? transaction.referralLevel + 1
                : referralCount + 1)
            : transaction.referralLevel;

        const txUpdate: Record<string, unknown> = {
            emailSent: true,
            discountRate: isBonusRate ? 3 : discountRate,
            isBonus: isBonusRate,
            referralLevel: newReferralLevel,
        };

        // If we computed bonus pricing above, ensure those fields are persisted
        // (defensive: sometimes earlier partial updates or race conditions left them empty).
        if (isBonusRate && bonusOriginalPrice !== null && bonusFinalPrice !== null && bonusAmount !== null) {
            txUpdate.originalPrice = bonusOriginalPrice;
            txUpdate.finalPrice = bonusFinalPrice;
            txUpdate.discountAmount = bonusAmount;
        }

        await ReferralTransactionModel.findByIdAndUpdate(transactionId, txUpdate).exec();

        return NextResponse.json({
            success: true,
            data: {
                transactionId,
                emailSent: true,
                discountRate: actualDiscountRate,
                referrerEmail: referrer.email,
                isBonus: isBonusRate,
            },
        });
    } catch (error: any) {
        console.error("Failed to send discount email:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to send email" },
            { status: 500 }
        );
    }
}
