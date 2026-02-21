/**
 * Admin Projects API – Types & Interfaces
 */

export interface UpdateProjectInput {
    slug: string;
    title: string;
    description?: unknown;
    role?: string;
    duration?: string;
    category?: string;
    technologies?: unknown;
    mainImage?: string;
    gallery?: string[];
    featured?: boolean;
    previousSlug?: string | null;
    nextSlug?: string | null;
}

export interface UpdateProjectResult {
    data: Record<string, unknown>;
    message: string;
    galleryWarning?: string;
}

export interface DeleteProjectResult {
    message: string;
    deletedImages: number;
}
