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
    createdAt: Date;
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
    },
    { timestamps: true }
);

const ReferralTransactionModel = (mongoose.models?.ReferralTransaction as mongoose.Model<IReferralTransaction>) || mongoose.model<IReferralTransaction>("ReferralTransaction", ReferralTransactionSchema);

export default ReferralTransactionModel;
