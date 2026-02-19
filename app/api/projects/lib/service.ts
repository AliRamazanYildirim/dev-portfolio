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
     * Alle veröffentlichten Projekte mit Gallery + Tags laden.
     * N+1-Fix: Gallery und Tags werden einmal gebündelt geladen
     * und per Map zugeordnet.
     */
    static async list(params: ProjectQueryParams) {
        const where: Record<string, unknown> = { published: true };
        if (params.featured) where.featured = true;

        const projects = await projectRepository.findMany({
            where,
            orderBy: { createdAt: "desc" },
        }) as unknown as Record<string, unknown>[];

        if (!projects || projects.length === 0) return [];

        // Alle Projekt-IDs sammeln
        const projectIds = projects.map((p) => String(p._id ?? p.id));

        // Gebündelter Laden: Gallery + Tags für alle Projekte in 2 Queries statt 2×N
        const [allGallery, allTags] = await Promise.all([
            projectImageRepository.findMany({
                where: { projectId: { $in: projectIds } },
                orderBy: { order: "asc" },
            }),
            projectTagRepository.findMany({
                where: { projects: { $in: projectIds } },
            }).catch(() => []),
        ]);

        // Maps aufbauen für O(1)-Zuordnung
        const galleryMap = new Map<string, typeof allGallery>();
        for (const img of ((allGallery || []) as unknown as Record<string, unknown>[])) {
            const pid = String(img.projectId);
            const arr = galleryMap.get(pid) || [];
            arr.push(img as never);
            galleryMap.set(pid, arr);
        }

        const tagMap = new Map<string, typeof allTags>();
        for (const tag of ((allTags || []) as unknown as Record<string, unknown>[])) {
            const pids = tag.projects;
            if (Array.isArray(pids)) {
                for (const pid of pids) {
                    const key = String(pid);
                    const arr = tagMap.get(key) || [];
                    arr.push(tag as never);
                    tagMap.set(key, arr);
                }
            }
        }

        return projects.map((p) => {
            const pid = String(p._id ?? p.id);

            let description = p.description;
            if (typeof description === "object" && description !== null) {
                description = {
                    en: (description as Record<string, string>).en || "",
                    de: (description as Record<string, string>).de || "",
                    tr: (description as Record<string, string>).tr || "",
                };
            }

            return {
                ...p,
                description,
                gallery: galleryMap.get(pid) || [],
                tags: tagMap.get(pid) || [],
            };
        });
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
        }) as unknown as Record<string, unknown>;

        const projectId = String(project._id ?? project.id);

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
        const project = await projectRepository.findUnique({ where: { slug } }) as Record<string, unknown> | null;
        if (!project || !project.published) return null;

        // previous/next berechnen
        const allProjects = await projectRepository.findMany({
            where: { published: true },
            orderBy: { createdAt: "asc" },
        }) as unknown as Record<string, unknown>[];

        let prev: string | null = null;
        let next: string | null = null;

        if (allProjects && allProjects.length > 0) {
            const index = allProjects.findIndex((p) => p.slug === slug);
            if (index !== -1) {
                prev = index > 0 ? allProjects[index - 1].slug as string : null;
                next = index < allProjects.length - 1 ? allProjects[index + 1].slug as string : null;
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
            where: { projectId: String(project._id ?? project.id) },
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
     * Navigation (previousSlug / nextSlug) für alle veröffentlichten Projekte aktualisieren.
     * Performance-Fix: Nutzt bulkWrite statt N sequenzieller Updates.
     */
    static async updateNavigation() {
        const projects = await projectRepository.findMany({
            where: { published: true },
            orderBy: { createdAt: "asc" },
        }) as unknown as Record<string, unknown>[];

        if (!projects || projects.length === 0) return;

        const operations = projects.map((current, i) => {
            const previous = i > 0 ? projects[i - 1] : null;
            const next = i < projects.length - 1 ? projects[i + 1] : null;

            return {
                id: String(current._id ?? current.id),
                data: {
                    previousSlug: (previous as Record<string, unknown>)?.slug || null,
                    nextSlug: (next as Record<string, unknown>)?.slug || null,
                },
            };
        });

        await projectRepository.bulkUpdate(operations);
    }
}
