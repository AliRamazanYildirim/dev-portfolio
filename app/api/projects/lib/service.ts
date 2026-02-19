/**
 * Projects API – Business Logic / Service Layer
 */

import {
    projectRepository,
    projectImageRepository,
    projectTagRepository,
} from "@/lib/repositories";
import type { CreateProjectInput, ProjectQueryParams } from "./types";

export class ProjectsService {
    /**
     * Alle veröffentlichten Projekte mit Gallery + Tags laden
     */
    static async list(params: ProjectQueryParams) {
        const where: Record<string, unknown> = { published: true };
        if (params.featured) where.featured = true;

        const projects = await projectRepository.findMany({
            where,
            orderBy: { createdAt: "desc" },
        }) as any[];

        return Promise.all(
            (projects ?? []).map(async (p: any) => {
                const gallery = await projectImageRepository.findMany({
                    where: { projectId: p._id ?? p.id },
                    orderBy: { order: "asc" },
                });
                const tags = await projectTagRepository.findMany({
                    where: { projects: p._id ?? p.id },
                }).catch(() => []);

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
        // Slug-Eindeutigkeit prüfen
        const existing = await projectRepository.findUnique({ where: { slug: input.slug } });
        if (existing) {
            return { success: false as const, error: "A project with this slug already exists" };
        }

        // Projekt anlegen
        const project = await projectRepository.create({
            data: {
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
            },
        }) as any;

        const projectId = project._id ?? project.id;

        // Gallery einfügen
        const galleryData = (input.gallery ?? []).map((url, index) => ({
            projectId,
            url,
            publicId: `portfolio_${input.slug}_${index}`,
            alt: `${input.title} screenshot ${index + 1}`,
            order: index,
        }));

        if (galleryData.length > 0) {
            await projectImageRepository.createMany({ data: galleryData });
        }

        // Navigation aktualisieren
        await this.updateNavigation();

        // Ergebnis mit Gallery + Tags zurückgeben
        const galleryRes = await projectImageRepository.findMany({
            where: { projectId },
        });
        const tagsRes = await projectTagRepository.findMany({
            where: { projects: projectId },
        }).catch(() => []);

        return {
            success: true as const,
            data: { ...project, gallery: galleryRes, tags: tagsRes },
        };
    }

    /**
     * Einzelnes Projekt anhand des Slugs mit Gallery + Navigation laden
     */
    static async getBySlug(slug: string) {
        const project = await projectRepository.findUnique({ where: { slug } }) as any;
        if (!project || !project.published) return null;

        // previous/next berechnen
        const allProjects = await projectRepository.findMany({
            where: { published: true },
            orderBy: { createdAt: "asc" },
        }) as any[];

        let prev: string | null = null;
        let next: string | null = null;

        if (allProjects && allProjects.length > 0) {
            const index = allProjects.findIndex((p: any) => p.slug === slug);
            if (index !== -1) {
                prev = index > 0 ? allProjects[index - 1].slug : null;
                next = index < allProjects.length - 1 ? allProjects[index + 1].slug : null;
            }
        }

        // Technologien parsen
        let technologies: string[] = [];
        try {
            if (typeof project.technologies === "string") {
                technologies = JSON.parse(project.technologies);
            } else if (Array.isArray(project.technologies)) {
                technologies = project.technologies as string[];
            }
        } catch {
            technologies =
                typeof project.technologies === "string"
                    ? project.technologies.split(",").map((tech: string) => tech.trim())
                    : [];
        }

        const gallery = await projectImageRepository.findMany({
            where: { projectId: project._id ?? project.id },
            orderBy: { order: "asc" },
        });

        return {
            ...project,
            gallery,
            technologies,
            previousSlug: prev,
            nextSlug: next,
        };
    }

    /**
     * Navigation (previousSlug / nextSlug) für alle veröffentlichten Projekte aktualisieren
     */
    static async updateNavigation() {
        const projects = await projectRepository.findMany({
            where: { published: true },
            orderBy: { createdAt: "asc" },
        }) as any[];

        if (!projects || projects.length === 0) return;

        for (let i = 0; i < projects.length; i++) {
            const current = projects[i];
            const previous = i > 0 ? projects[i - 1] : null;
            const next = i < projects.length - 1 ? projects[i + 1] : null;

            await projectRepository.update({
                where: { id: current._id ?? current.id },
                data: {
                    previousSlug: previous?.slug || null,
                    nextSlug: next?.slug || null,
                },
            });
        }
    }
}
