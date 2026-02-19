/**
 * Projects API – Business Logic / Service Layer
 */

import { connectToMongo } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import ProjectImageModel from "@/models/ProjectImage";
import ProjectTagModel from "@/models/ProjectTag";
import type { CreateProjectInput, ProjectQueryParams } from "./types";

export class ProjectsService {
    /**
     * Alle veröffentlichten Projekte mit Gallery + Tags laden
     */
    static async list(params: ProjectQueryParams) {
        await connectToMongo();

        const where: Record<string, unknown> = { published: true };
        if (params.featured) where.featured = true;

        const projects = await ProjectModel.find(where)
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return Promise.all(
            projects.map(async (p) => {
                const gallery = await ProjectImageModel.find({ projectId: p._id })
                    .sort({ order: 1 })
                    .lean()
                    .exec();
                const tags = await ProjectTagModel.find({ projects: p._id })
                    .lean()
                    .exec()
                    .catch(() => []);

                let description = p.description;
                if (typeof description === "object" && description !== null) {
                    description = {
                        en: (description as Record<string, string>).en || "",
                        de: (description as Record<string, string>).de || "",
                        tr: (description as Record<string, string>).tr || "",
                    };
                }

                return { ...p, description, gallery, tags };
            }),
        );
    }

    /**
     * Neues Projekt erstellen + Gallery + Navigation aktualisieren
     */
    static async create(input: CreateProjectInput) {
        await connectToMongo();

        // Slug-Eindeutigkeit prüfen
        const existing = await ProjectModel.findOne({ slug: input.slug }).exec();
        if (existing) {
            return { success: false as const, error: "A project with this slug already exists" };
        }

        // Projekt anlegen
        const project = await ProjectModel.create({
            slug: input.slug,
            title: input.title,
            description: input.description,
            role: input.role,
            duration: input.duration,
            category: input.category,
            technologies: input.technologies,
            mainImage: input.mainImage,
            featured: input.featured,
            published: true,
            updatedAt: new Date(),
            previousSlug: input.previousSlug,
            nextSlug: input.nextSlug,
        });

        // Gallery einfügen
        const gallery = (input.gallery ?? []).map((url, index) => ({
            projectId: project._id,
            url,
            publicId: `portfolio_${input.slug}_${index}`,
            alt: `${input.title} screenshot ${index + 1}`,
            order: index,
        }));

        if (gallery.length > 0) {
            await ProjectImageModel.insertMany(gallery);
        }

        // Navigation aktualisieren
        await this.updateNavigation();

        // Ergebnis mit Gallery + Tags zurückgeben
        const galleryRes = await ProjectImageModel.find({ projectId: project._id })
            .lean()
            .exec();
        const tagsRes = await ProjectTagModel.find({ projects: project._id })
            .lean()
            .exec()
            .catch(() => []);

        return {
            success: true as const,
            data: { ...project.toObject(), gallery: galleryRes, tags: tagsRes },
        };
    }

    /**
     * Navigation (previousSlug / nextSlug) für alle veröffentlichten Projekte aktualisieren
     */
    static async updateNavigation() {
        const projects = await ProjectModel.find({ published: true })
            .sort({ createdAt: 1 })
            .lean()
            .exec();

        if (!projects || projects.length === 0) return;

        for (let i = 0; i < projects.length; i++) {
            const current = projects[i];
            const previous = i > 0 ? projects[i - 1] : null;
            const next = i < projects.length - 1 ? projects[i + 1] : null;

            await ProjectModel.findByIdAndUpdate(current._id, {
                previousSlug: previous?.slug || null,
                nextSlug: next?.slug || null,
            }).exec();
        }
    }
}
