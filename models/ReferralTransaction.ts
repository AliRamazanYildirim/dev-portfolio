import mongoose from "../lib/mongodb";
import { createId } from "@paralleldrive/cuid2";

const { Schema } = mongoose;

export interface IReferralTransaction {
    _id: string;
    referrerCode: string;
    newCustomerId: string;
    discountRate: number;
    originalPrice: number;
    finalPrice: number;
    referralLevel: number;
    invoiceStatus: "pending" | "sent";
    invoiceNumber?: string | null;
    invoiceSentAt?: Date | null;
    emailSent: boolean;
    isBonus: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

const ReferralTransactionSchema = new Schema<IReferralTransaction>(
    {
        _id: { type: String, default: () => createId() },
        referrerCode: { type: String, required: true },
        newCustomerId: { type: String, required: true },
        discountRate: { type: Number, required: true },
        originalPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
        referralLevel: { type: Number, required: true },
        invoiceStatus: { type: String, enum: ["pending", "sent"], default: "pending" },
        invoiceNumber: { type: String, default: null },
        invoiceSentAt: { type: Date, default: null },
        emailSent: { type: Boolean, default: false },
        isBonus: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const ReferralTransactionModel = (mongoose.models?.ReferralTransaction as mongoose.Model<IReferralTransaction>) || mongoose.model<IReferralTransaction>("ReferralTransaction", ReferralTransactionSchema);

export default ReferralTransactionModel;
