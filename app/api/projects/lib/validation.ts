/**
 * Projects API – Input Validation
 */

import type { CreateProjectInput } from "./types";

export function validateCreateProjectBody(
    body: unknown,
): { valid: true; value: CreateProjectInput } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    const slug = typeof obj.slug === "string" ? obj.slug.trim() : "";
    if (!slug) {
        return { valid: false, error: "Slug is required" };
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return {
            valid: false,
            error: "Slug must be lowercase alphanumeric with hyphens only",
        };
    }

    const title = typeof obj.title === "string" ? obj.title.trim() : "";
    if (!title) {
        return { valid: false, error: "Title is required" };
    }

    if (!obj.description) {
        return { valid: false, error: "Description is required" };
    }

    const mainImage = typeof obj.mainImage === "string" ? obj.mainImage.trim() : "";
    if (!mainImage) {
        return { valid: false, error: "Main image is required" };
    }

    return {
        valid: true,
        value: {
            slug,
            title,
            description: obj.description as string,
            role: typeof obj.role === "string" ? obj.role.trim() : "",
            duration: typeof obj.duration === "string" ? obj.duration.trim() : "",
            category: typeof obj.category === "string" ? obj.category.trim() : "",
            technologies:
                typeof obj.technologies === "string" ? obj.technologies.trim() : "",
            mainImage,
            gallery: Array.isArray(obj.gallery) ? obj.gallery : [],
            featured: obj.featured === true,
            previousSlug:
                typeof obj.previousSlug === "string" ? obj.previousSlug : null,
            nextSlug: typeof obj.nextSlug === "string" ? obj.nextSlug : null,
        },
    };
}
