/**
 * Projects API – Types & Interfaces
 */

export interface ProjectDescription {
    en: string;
    de: string;
    tr: string;
}

export interface CreateProjectInput {
    slug: string;
    title: string;
    description: string | ProjectDescription;
    role: string;
    duration: string;
    category: string;
    technologies: string;
    mainImage: string;
    gallery?: string[];
    featured?: boolean;
    previousSlug?: string | null;
    nextSlug?: string | null;
}

export interface ProjectQueryParams {
    featured?: boolean;
    limit?: number;
}
