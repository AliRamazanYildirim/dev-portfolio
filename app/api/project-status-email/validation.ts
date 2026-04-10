/**
 * Project Status Email API – Input Validation
 */

import type { ProjectStatusPayload } from "./lib/types";
import { isValidEmail } from "@/lib/validation";

function normalizeOptionalHttpUrl(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    try {
        const url = new URL(trimmed);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return undefined;
        }

        return url.toString();
    } catch {
        return undefined;
    }
}

export function validateProjectStatusPayload(
    body: unknown,
): { valid: true; value: ProjectStatusPayload } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    const clientEmail = typeof obj.clientEmail === "string" ? obj.clientEmail.trim() : "";
    if (!clientEmail) {
        return { valid: false, error: "Client email is required" };
    }

    if (!isValidEmail(clientEmail)) {
        return { valid: false, error: "Client email format is invalid" };
    }

    const clientName = typeof obj.clientName === "string" ? obj.clientName.trim() : "";
    if (!clientName) {
        return { valid: false, error: "Client name is required" };
    }

    const validStatuses = ["gestart", "in-vorbereitung", "abgeschlossen"] as const;
    if (!obj.status || !validStatuses.includes(obj.status as typeof validStatuses[number])) {
        return {
            valid: false,
            error: `Status must be one of: ${validStatuses.join(", ")}`,
        };
    }

    const ctaUrl = normalizeOptionalHttpUrl(obj.ctaUrl);
    if (obj.ctaUrl !== undefined && typeof obj.ctaUrl === "string" && obj.ctaUrl.trim() && !ctaUrl) {
        return { valid: false, error: "CTA URL must be a valid http(s) URL" };
    }

    return {
        valid: true,
        value: {
            clientName,
            clientEmail,
            projectTitle: typeof obj.projectTitle === "string" ? obj.projectTitle.trim() : undefined,
            status: obj.status as ProjectStatusPayload["status"],
            message: typeof obj.message === "string" ? obj.message.trim() : undefined,
            projectImage: typeof obj.projectImage === "string" ? obj.projectImage.trim() : undefined,
            ctaUrl,
        },
    };
}
