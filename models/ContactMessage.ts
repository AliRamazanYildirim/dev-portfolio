import mongoose from "../lib/mongodb";
import { createId } from "@paralleldrive/cuid2";

const { Schema } = mongoose;

export interface IContactMessage {
    _id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
    {
        _id: { type: String, default: () => createId() },
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const ContactMessageModel = (mongoose.models?.ContactMessage as mongoose.Model<IContactMessage>) || mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessageModel;
