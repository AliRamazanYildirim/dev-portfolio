import mongoose from "../lib/mongodb";

const { Schema } = mongoose;

export interface IAdmin {
    email: string;
    name: string;
    password: string; // hashed
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        name: { type: String, default: "Admin" },
        password: { type: String, required: true },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Avoid model overwrite in dev/hot-reload
const AdminModel = (mongoose.models?.Admin as mongoose.Model<IAdmin>) || mongoose.model<IAdmin>("Admin", AdminSchema);

export default AdminModel;
