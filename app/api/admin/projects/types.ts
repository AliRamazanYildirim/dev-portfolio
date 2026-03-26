/**
 * Admin Projects API – Types & Interfaces
 */

import type { CreateProjectInput } from "@/app/api/projects/types";
import type { ProjectReadDto } from "@/app/api/projects/lib/dto";

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

export type AdminProjectCreateRequest = CreateProjectInput;

export interface CreateProjectResult {
    data: ProjectReadDto;
    message: string;
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
