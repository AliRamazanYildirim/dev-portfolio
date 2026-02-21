import { ValidationError } from "@/lib/errors";
import type { LoginRequest } from "./types";

export function validateLoginBody(body: unknown): LoginRequest {
    if (!body || typeof body !== "object") {
        throw new ValidationError("Request body is required");
    }

    const { email, password } = body as Record<string, unknown>;

    if (!email || typeof email !== "string") {
        throw new ValidationError("Email is required");
    }

    if (!password || typeof password !== "string") {
        throw new ValidationError("Password is required");
    }

    return {
        email: email.trim(),
        password,
    };
}
