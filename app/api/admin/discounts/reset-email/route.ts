import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import { buildCorrectionEmailHTML } from "@/app/api/admin/customers/lib/email-templates";
import { sendAdminEmail } from "@/app/api/admin/customers/lib/mailer";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactionId, sendCorrectionEmail = true } = body;

        if (!transactionId) {
            return NextResponse.json(
                { success: false, error: "Transaction ID is required" },
                { status: 400 }
            );
        }

        await connectToMongo();

        const transaction = await ReferralTransactionModel.findById(transactionId).exec();
        if (!transaction) {
            return NextResponse.json(
                { success: false, error: "Transaction not found" },
                { status: 404 }
            );
        }

        if (!transaction.emailSent) {
            return NextResponse.json(
                { success: false, error: "Email was not sent for this transaction, nothing to reset" },
                { status: 400 }
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

        // Store original values for correction email
        const originalDiscountRate = transaction.discountRate;
        const originalAmount = Math.max(transaction.originalPrice - transaction.finalPrice, 0);

        // Send correction email if requested
        if (sendCorrectionEmail && referrer.email) {
            const { html, subject } = buildCorrectionEmailHTML({
                refFirst: referrer.firstname ?? "",
                refLast: referrer.lastname ?? "",
                myReferralCode: referrer.myReferralCode ?? "",
                originalDiscountRate,
                originalAmount,
            });

            await sendAdminEmail({
                to: referrer.email,
                subject,
                html,
            });
        }

        // Reset transaction emailSent status
        await ReferralTransactionModel.findByIdAndUpdate(transactionId, {
            emailSent: false,
            isBonus: false,
        }).exec();

        return NextResponse.json({
            success: true,
            data: {
                transactionId,
                emailSent: false,
                correctionEmailSent: sendCorrectionEmail && !!referrer.email,
                referrerEmail: referrer.email,
            },
        });
    } catch (error: unknown) {
        console.error("Failed to reset email status:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to reset email status";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
