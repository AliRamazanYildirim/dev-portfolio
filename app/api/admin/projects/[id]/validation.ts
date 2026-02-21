import { ValidationError } from "@/lib/errors";
import { validateUpdateProjectBody } from "../validation";
import type { AdminProjectIdParams, AdminProjectUpdateRequest } from "./types";

export function validateProjectId(id: string): AdminProjectIdParams {
    const normalized = id.trim();
    if (!normalized) {
        throw new ValidationError("Project id is required");
    }

    return { id: normalized };
}

export function validateUpdateBody(
    body: unknown,
): { valid: true; value: AdminProjectUpdateRequest } | { valid: false; error: string } {
    return validateUpdateProjectBody(body);
}
