import mongoose from "../lib/mongodb";
import { createId } from "@paralleldrive/cuid2";

const { Schema } = mongoose;

export interface IProject {
    _id: string;
    slug: string;
    title: string;
    author: string;
    description: string;
    role: string;
    duration: string;
    category: string;
    technologies: string;
    mainImage: string;
    featured: boolean;
    published: boolean;
    previousSlug?: string | null;
    nextSlug?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        _id: { type: String, default: () => createId() },
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        author: { type: String, default: "Ali Ramazan" },
        description: { type: String },
        role: { type: String },
        duration: { type: String },
        category: { type: String },
        technologies: { type: String },
        mainImage: { type: String },
        featured: { type: Boolean, default: false },
        published: { type: Boolean, default: true },
        previousSlug: { type: String, default: null },
        nextSlug: { type: String, default: null },
    },
    { timestamps: true }
);

const ProjectModel = (mongoose.models?.Project as mongoose.Model<IProject>) || mongoose.model<IProject>("Project", ProjectSchema);

export default ProjectModel;
