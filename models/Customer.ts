import mongoose from "../lib/mongodb";
import { createId } from "@paralleldrive/cuid2";

const { Schema } = mongoose;

export interface ICustomer {
    _id: string;
    firstname: string;
    lastname: string;
    companyname: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    postcode?: string;
    reference?: string;
    price?: number;
    finalPrice?: number;
    discountRate?: number;
    myReferralCode?: string;
    referralCount?: number;
    totalEarnings?: number;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
    {
        _id: { type: String, default: () => createId() },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        companyname: { type: String, default: "" },
        email: { type: String, required: true, unique: true },
        phone: { type: String, default: "" },
        address: { type: String, default: "" },
        city: { type: String },
        postcode: { type: String },
        reference: { type: String },
        price: { type: Number },
        finalPrice: { type: Number },
        discountRate: { type: Number },
        myReferralCode: { type: String, unique: true, sparse: true },
        referralCount: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const CustomerModel = (mongoose.models?.Customer as mongoose.Model<ICustomer>) || mongoose.model<ICustomer>("Customer", CustomerSchema);

export default CustomerModel;
