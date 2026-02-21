/**
 * Project Status Email API – Input Validation
 */

import type { ProjectStatusPayload } from "./lib/types";

export function validateProjectStatusPayload(
    body: unknown,
): { valid: true; value: ProjectStatusPayload } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    if (!obj.clientEmail || typeof obj.clientEmail !== "string") {
        return { valid: false, error: "Client email is required" };
    }

    if (!obj.clientName || typeof obj.clientName !== "string") {
        return { valid: false, error: "Client name is required" };
    }

    const validStatuses = ["gestart", "in-vorbereitung", "abgeschlossen"] as const;
    if (!obj.status || !validStatuses.includes(obj.status as typeof validStatuses[number])) {
        return {
            valid: false,
            error: `Status must be one of: ${validStatuses.join(", ")}`,
        };
    }

    return {
        valid: true,
        value: {
            clientName: (obj.clientName as string).trim(),
            clientEmail: (obj.clientEmail as string).trim(),
            projectTitle: typeof obj.projectTitle === "string" ? obj.projectTitle.trim() : undefined,
            status: obj.status as ProjectStatusPayload["status"],
            message: typeof obj.message === "string" ? obj.message.trim() : undefined,
            projectImage: typeof obj.projectImage === "string" ? obj.projectImage.trim() : undefined,
            ctaUrl: typeof obj.ctaUrl === "string" ? obj.ctaUrl.trim() : undefined,
        },
    };
}
