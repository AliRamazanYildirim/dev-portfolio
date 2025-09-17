import mongoose from "../lib/mongodb";
import { createId } from "@paralleldrive/cuid2";

const { Schema } = mongoose;

export interface IProjectTag {
    _id: string;
    name: string;
    color: string;
    createdAt: Date;
}

const ProjectTagSchema = new Schema<IProjectTag>(
    {
        _id: { type: String, default: () => createId() },
        name: { type: String, required: true, unique: true },
        color: { type: String, default: "#3b82f6" },
    },
    { timestamps: true }
);

const ProjectTagModel = (mongoose.models?.ProjectTag as mongoose.Model<IProjectTag>) || mongoose.model<IProjectTag>("ProjectTag", ProjectTagSchema);

export default ProjectTagModel;
