import mongoose from "../lib/mongodb";
import { createId } from "@paralleldrive/cuid2";

const { Schema } = mongoose;

export interface IProjectImage {
    _id: string;
    projectId: string;
    url: string;
    publicId: string;
    alt?: string;
    order: number;
    createdAt: Date;
}

const ProjectImageSchema = new Schema<IProjectImage>(
    {
        _id: { type: String, default: () => createId() },
        projectId: { type: String, required: true },
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: { type: String },
        order: { type: Number, default: 0 },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const ProjectImageModel = (mongoose.models?.ProjectImage as mongoose.Model<IProjectImage>) || mongoose.model<IProjectImage>("ProjectImage", ProjectImageSchema);

export default ProjectImageModel;
