/**
 * Project Domain DTOs – Typ-sichere Read-/Write-Modelle.
 *
 * Eliminiert `unknown`/`as`-Cast-Ketten im gesamten Projects-Domain.
 */

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

export function toProjectReadDto(
    raw: Record<string, unknown>,
    gallery: unknown[] = [],
    tags: unknown[] = [],
): ProjectReadDto {
    return {
        id: String(raw._id ?? raw.id),
        _id: raw._id ? String(raw._id) : undefined,
        slug: (raw.slug as string) ?? "",
        title: (raw.title as string) ?? "",
        author: (raw.author as string) ?? undefined,
        description: normalizeDescription(raw.description),
        role: (raw.role as string) ?? "",
        duration: (raw.duration as string) ?? "",
        category: (raw.category as string) ?? "",
        technologies: raw.technologies as string,
        mainImage: (raw.mainImage as string) ?? "",
        featured: Boolean(raw.featured),
        published: Boolean(raw.published),
        previousSlug: (raw.previousSlug as string) ?? null,
        nextSlug: (raw.nextSlug as string) ?? null,
        gallery: gallery.map(toGalleryItemDto),
        tags: tags.map(toTagDto),
        createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt as string),
        updatedAt: raw.updatedAt instanceof Date ? raw.updatedAt : new Date(raw.updatedAt as string),
    };
}

export function toProjectDetailDto(
    raw: Record<string, unknown>,
    gallery: unknown[] = [],
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
    raw: Record<string, unknown>,
    gallery: unknown[] = [],
    tags: unknown[] = [],
): ProjectListItemDto {
    return {
        id: String(raw._id ?? raw.id),
        slug: (raw.slug as string) ?? "",
        title: (raw.title as string) ?? "",
        description: normalizeDescription(raw.description),
        category: (raw.category as string) ?? "",
        mainImage: (raw.mainImage as string) ?? "",
        featured: Boolean(raw.featured),
        gallery: gallery.map(toGalleryItemDto),
        tags: tags.map(toTagDto),
    };
}

function toGalleryItemDto(raw: unknown): ProjectGalleryItemDto {
    const obj = raw as Record<string, unknown>;
    return {
        id: String(obj._id ?? obj.id ?? ""),
        projectId: String(obj.projectId ?? ""),
        url: (obj.url as string) ?? "",
        publicId: (obj.publicId as string) ?? undefined,
        alt: (obj.alt as string) ?? undefined,
        order: Number(obj.order ?? 0),
    };
}

function toTagDto(raw: unknown): ProjectTagDto {
    const obj = raw as Record<string, unknown>;
    return {
        id: String(obj._id ?? obj.id ?? ""),
        name: (obj.name as string) ?? "",
        projects: Array.isArray(obj.projects) ? obj.projects.map(String) : [],
    };
}
