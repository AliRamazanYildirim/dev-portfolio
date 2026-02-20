/**
 * Project Domain DTOs – Typ-sichere Read-/Write-Modelle.
 *
 * v2: Mapper-Funktionen akzeptieren jetzt typisierte Model-Interfaces
 * (IProject, IProjectImage, IProjectTag) statt Record<string, unknown>.
 * unknown-Casts auf ein Minimum reduziert.
 */

import type { IProject } from "@/models/Project";
import type { IProjectImage } from "@/models/ProjectImage";
import type { IProjectTag } from "@/models/ProjectTag";

/* ---------- Shared ---------- */

export interface ProjectDescriptionDto {
    en: string;
    de: string;
    tr: string;
}

export interface ProjectGalleryItemDto {
    id: string;
    projectId: string;
    url: string;
    publicId?: string;
    alt?: string;
    order: number;
}

export interface ProjectTagDto {
    id: string;
    name: string;
    projects: string[];
}

/* ---------- Read DTOs ---------- */

export interface ProjectReadDto {
    id: string;
    _id?: string;
    slug: string;
    title: string;
    author?: string;
    description: ProjectDescriptionDto | string;
    role: string;
    duration: string;
    category: string;
    technologies: string | string[];
    mainImage: string;
    featured: boolean;
    published: boolean;
    previousSlug?: string | null;
    nextSlug?: string | null;
    gallery: ProjectGalleryItemDto[];
    tags: ProjectTagDto[];
    createdAt: Date;
    updatedAt: Date;
}

/** Detail-Ansicht mit Navigation */
export interface ProjectDetailDto extends ProjectReadDto {
    technologies: string[];
}

/** Listen-Ansicht (kompakt) */
export interface ProjectListItemDto {
    id: string;
    slug: string;
    title: string;
    description: ProjectDescriptionDto | string;
    category: string;
    mainImage: string;
    featured: boolean;
    gallery: ProjectGalleryItemDto[];
    tags: ProjectTagDto[];
}

/* ---------- Mapper ---------- */

/**
 * Normalisiert eine rohe Beschreibung in ein typisiertes Objekt.
 */
function normalizeDescription(raw: unknown): ProjectDescriptionDto | string {
    if (typeof raw === "string") return raw;
    if (typeof raw === "object" && raw !== null) {
        const obj = raw as Record<string, string>;
        return {
            en: obj.en || "",
            de: obj.de || "",
            tr: obj.tr || "",
        };
    }
    return "";
}

/**
 * Typed Mapper: IProject + IProjectImage[] + Tag-Rohdaten → ProjectReadDto.
 * unknown-Casts eliminiert – direkte Model-Interface-Nutzung.
 */
export function toProjectReadDto(
    raw: IProject | Record<string, unknown>,
    gallery: IProjectImage[] | unknown[] = [],
    tags: ProjectTagRaw[] | unknown[] = [],
): ProjectReadDto {
    const doc = raw as IProject & Record<string, unknown>;
    return {
        id: String(doc._id ?? (doc as Record<string, unknown>).id),
        _id: doc._id ? String(doc._id) : undefined,
        slug: doc.slug ?? "",
        title: doc.title ?? "",
        author: doc.author ?? undefined,
        description: normalizeDescription(doc.description),
        role: doc.role ?? "",
        duration: doc.duration ?? "",
        category: doc.category ?? "",
        technologies: doc.technologies,
        mainImage: doc.mainImage ?? "",
        featured: Boolean(doc.featured),
        published: Boolean(doc.published),
        previousSlug: doc.previousSlug ?? null,
        nextSlug: doc.nextSlug ?? null,
        gallery: (gallery as IProjectImage[]).map(toGalleryItemDto),
        tags: (tags as ProjectTagRaw[]).map(toTagDto),
        createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt as unknown as string),
        updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt as unknown as string),
    };
}

export function toProjectDetailDto(
    raw: IProject | Record<string, unknown>,
    gallery: IProjectImage[] | unknown[] = [],
    technologies: string[] = [],
    previousSlug: string | null = null,
    nextSlug: string | null = null,
): ProjectDetailDto {
    return {
        ...toProjectReadDto(raw, gallery),
        technologies,
        previousSlug,
        nextSlug,
    };
}

export function toProjectListItemDto(
    raw: IProject | Record<string, unknown>,
    gallery: IProjectImage[] | unknown[] = [],
    tags: ProjectTagRaw[] | unknown[] = [],
): ProjectListItemDto {
    const doc = raw as IProject & Record<string, unknown>;
    return {
        id: String(doc._id ?? (doc as Record<string, unknown>).id),
        slug: doc.slug ?? "",
        title: doc.title ?? "",
        description: normalizeDescription(doc.description),
        category: doc.category ?? "",
        mainImage: doc.mainImage ?? "",
        featured: Boolean(doc.featured),
        gallery: (gallery as IProjectImage[]).map(toGalleryItemDto),
        tags: (tags as ProjectTagRaw[]).map(toTagDto),
    };
}

/** Tag-Dokumente (Mongoose leak) projects alanı içerebilir – IProjectTag'den genişletilmiş */
type ProjectTagRaw = IProjectTag & { projects?: string[] };

function toGalleryItemDto(raw: IProjectImage | unknown): ProjectGalleryItemDto {
    const obj = raw as IProjectImage & Record<string, unknown>;
    return {
        id: String(obj._id ?? obj.id ?? ""),
        projectId: String(obj.projectId ?? ""),
        url: obj.url ?? "",
        publicId: obj.publicId ?? undefined,
        alt: obj.alt ?? undefined,
        order: Number(obj.order ?? 0),
    };
}

function toTagDto(raw: ProjectTagRaw | unknown): ProjectTagDto {
    const obj = raw as ProjectTagRaw;
    return {
        id: String(obj._id ?? (obj as unknown as Record<string, unknown>).id ?? ""),
        name: obj.name ?? "",
        projects: Array.isArray(obj.projects) ? obj.projects.map(String) : [],
    };
}
