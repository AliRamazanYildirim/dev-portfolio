import { ValidationError } from "@/lib/errors";
import type { ProjectSlugParams } from "./types";

export function validateProjectSlug(slug: string): ProjectSlugParams {
    const normalized = slug.trim();

    if (!normalized) {
        throw new ValidationError("Project slug is required");
    }

    return { slug: normalized };
}
