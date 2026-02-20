/**
 * Projects API – Business Logic / Service Layer
 *
 * SRP-Refactored v2: Read/Write ayrımı (CQRS-lite).
 *  - ProjectReadService: list, getBySlug (sorgulama)
 *  - ProjectWriteService: create, updateNavigation (değişiklik)
 *  - ProjectsService: geriye uyumlu facade
 *  - DTOs: typ-sichere Mapper mit Model-Interfaces (IProject, IProjectImage)
 */

import {
    projectRepository,
    projectImageRepository,
    projectTagRepository,
} from "@/lib/repositories";
import type { IProject } from "@/models/Project";
import type { IProjectImage } from "@/models/ProjectImage";
import type { IProjectTag } from "@/models/ProjectTag";
import type { CreateProjectInput, ProjectQueryParams } from "./types";
import {
    toProjectReadDto,
    toProjectDetailDto,
    type ProjectReadDto,
    type ProjectDetailDto,
    type ProjectGalleryItemDto,
    type ProjectTagDto,
} from "./dto";

/* ================================================================
 * READ SERVICE
 * ================================================================ */

export class ProjectReadService {
    /**
     * Alle veröffentlichten Projekte mit Gallery + Tags laden.
     * N+1-Fix: Gallery und Tags werden einmal gebündelt geladen
     * und per Map zugeordnet.
     */
    static async list(params: ProjectQueryParams): Promise<ProjectReadDto[]> {
        const where: Record<string, unknown> = { published: true };
        if (params.featured) where.featured = true;

        const projects = await projectRepository.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        if (!projects || projects.length === 0) return [];

        const projectIds = projects.map((p) => String(p._id));

        const [allGallery, allTags] = await Promise.all([
            projectImageRepository.findMany({
                where: { projectId: { $in: projectIds } },
                orderBy: { order: "asc" },
            }),
            projectTagRepository.findMany({
                where: { projects: { $in: projectIds } },
            }).catch(() => [] as IProjectTag[]),
        ]);

        const galleryMap = ProjectReadService.buildGalleryMap(allGallery);
        const tagMap = ProjectReadService.buildTagMap(allTags as Array<IProjectTag & { projects?: string[] }>);

        return projects.map((p) => {
            const pid = String(p._id);
            return toProjectReadDto(
                p,
                galleryMap.get(pid) || [],
                tagMap.get(pid) || [],
            );
        });
    }

    /**
     * Einzelnes Projekt anhand des Slugs mit Gallery + Navigation laden
     */
    static async getBySlug(slug: string): Promise<ProjectDetailDto | null> {
        const project = await projectRepository.findUnique({ where: { slug } });
        if (!project || !project.published) return null;

        const { prev, next } = await ProjectReadService.resolveNavigation(slug);
        const technologies = ProjectReadService.parseTechnologies(project.technologies);

        const gallery = await projectImageRepository.findMany({
            where: { projectId: String(project._id) },
            orderBy: { order: "asc" },
        });

        return toProjectDetailDto(
            project,
            gallery,
            technologies,
            prev,
            next,
        );
    }

    /* ---------- Private Helpers ---------- */

    private static buildGalleryMap(allGallery: IProjectImage[]): Map<string, IProjectImage[]> {
        const map = new Map<string, IProjectImage[]>();
        for (const img of allGallery) {
            const pid = String(img.projectId);
            const arr = map.get(pid) || [];
            arr.push(img);
            map.set(pid, arr);
        }
        return map;
    }

    private static buildTagMap(allTags: Array<IProjectTag & { projects?: string[] }>): Map<string, Array<IProjectTag & { projects?: string[] }>> {
        const map = new Map<string, Array<IProjectTag & { projects?: string[] }>>();
        for (const tag of allTags) {
            const pids = tag.projects;
            if (Array.isArray(pids)) {
                for (const pid of pids) {
                    const key = String(pid);
                    const arr = map.get(key) || [];
                    arr.push(tag);
                    map.set(key, arr);
                }
            }
        }
        return map;
    }

    private static async resolveNavigation(slug: string): Promise<{ prev: string | null; next: string | null }> {
        const allProjects = await projectRepository.findMany({
            where: { published: true },
            orderBy: { createdAt: "asc" },
        });

        let prev: string | null = null;
        let next: string | null = null;

        if (allProjects && allProjects.length > 0) {
            const index = allProjects.findIndex((p) => p.slug === slug);
            if (index !== -1) {
                prev = index > 0 ? allProjects[index - 1].slug : null;
                next = index < allProjects.length - 1 ? allProjects[index + 1].slug : null;
            }
        }

        return { prev, next };
    }

    private static parseTechnologies(raw: unknown): string[] {
        try {
            if (typeof raw === "string") {
                return JSON.parse(raw);
            }
            if (Array.isArray(raw)) {
                return raw as string[];
            }
        } catch {
            if (typeof raw === "string") {
                return raw.split(",").map((tech: string) => tech.trim());
            }
        }
        return [];
    }
}

/* ================================================================
 * WRITE SERVICE
 * ================================================================ */

export class ProjectWriteService {
    /**
     * Neues Projekt erstellen + Gallery + Navigation aktualisieren
     */
    static async create(input: CreateProjectInput) {
        // Slug-Eindeutigkeit prüfen
        const existing = await projectRepository.findUnique({ where: { slug: input.slug } });
        if (existing) {
            return { success: false as const, error: "A project with this slug already exists" };
        }

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
        });

        const projectId = String(project._id);

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

        const galleryRes = await projectImageRepository.findMany({
            where: { projectId },
        });
        const tagsRes = await projectTagRepository.findMany({
            where: { projects: projectId },
        }).catch(() => [] as IProjectTag[]);

        return {
            success: true as const,
            data: toProjectReadDto(
                project,
                galleryRes,
                tagsRes as Array<IProjectTag & { projects?: string[] }>,
            ),
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
        });

        if (!projects || projects.length === 0) return;

        const operations = projects.map((current, i) => {
            const previous = i > 0 ? projects[i - 1] : null;
            const next = i < projects.length - 1 ? projects[i + 1] : null;

            return {
                id: String(current._id),
                data: {
                    previousSlug: previous?.slug || null,
                    nextSlug: next?.slug || null,
                },
            };
        });

        await projectRepository.bulkUpdate(operations);
    }
}

/* ================================================================
 * FACADE – Geriye uyumlu adapter
 * ================================================================ */

export class ProjectsService {
    static list = ProjectReadService.list;
    static getBySlug = ProjectReadService.getBySlug;
    static create = ProjectWriteService.create.bind(ProjectWriteService);
    static updateNavigation = ProjectWriteService.updateNavigation;
}
