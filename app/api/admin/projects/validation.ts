/**
 * Admin Projects API – Input Validation
 */

import type { UpdateProjectInput } from "./types";

export function validateUpdateProjectBody(
    body: unknown,
): { valid: true; value: UpdateProjectInput } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    const title = typeof obj.title === "string" ? obj.title.trim() : "";
    if (!title) {
        return { valid: false, error: "Title is required" };
    }

    const slug = typeof obj.slug === "string" ? obj.slug.trim() : "";
    if (!slug) {
        return { valid: false, error: "Slug is required" };
    }

    return {
        valid: true,
        value: {
            slug,
            title,
            description: obj.description,
            role: typeof obj.role === "string" ? obj.role.trim() : undefined,
            duration: typeof obj.duration === "string" ? obj.duration.trim() : undefined,
            category: typeof obj.category === "string" ? obj.category.trim() : undefined,
            technologies: obj.technologies,
            mainImage: typeof obj.mainImage === "string" ? obj.mainImage.trim() : undefined,
            gallery: Array.isArray(obj.gallery) ? obj.gallery : [],
            featured: obj.featured === true,
            previousSlug: typeof obj.previousSlug === "string" ? obj.previousSlug : null,
            nextSlug: typeof obj.nextSlug === "string" ? obj.nextSlug : null,
        },
    };
}
