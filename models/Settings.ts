import { randomUUID } from "crypto";
import mongoose from "../lib/mongodb";

const { Schema } = mongoose;

export interface ISetting {
    _id: string;
    key: string;
    booleanValue?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SettingsSchema = new Schema<ISetting>(
    {
        _id: { type: String, default: () => randomUUID() },
        key: { type: String, required: true, unique: true },
        booleanValue: { type: Boolean, default: undefined },
    },
    { timestamps: true }
);

const SettingsModel =
    (mongoose.models?.Settings as mongoose.Model<ISetting>) ||
    mongoose.model<ISetting>("Settings", SettingsSchema);

export default SettingsModel;
