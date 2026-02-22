import type {
    AdminSessionResponse,
    AdminSessionSuccessResponse,
    AdminSessionUser,
} from "./types";

export type {
    AdminSessionFailureResponse,
    AdminSessionResponse,
    AdminSessionSuccessResponse,
    AdminSessionUser,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isAdminSessionUser(value: unknown): value is AdminSessionUser {
    if (!isRecord(value)) return false;

    return (
        typeof value.id === "string" &&
        typeof value.email === "string" &&
        typeof value.name === "string"
    );
}

export function createAdminSessionSuccessResponse(
    user: AdminSessionUser,
): AdminSessionSuccessResponse {
    return {
        success: true,
        authenticated: true,
        user,
    };
}

export function parseAdminSessionResponse(
    value: unknown,
): AdminSessionResponse {
    if (!isRecord(value)) {
        return { success: false, authenticated: false, error: "invalid-response" };
    }

    if (
        value.success === true &&
        value.authenticated === true &&
        isAdminSessionUser(value.user)
    ) {
        return {
            success: true,
            authenticated: true,
            user: value.user,
        };
    }

    const error = typeof value.error === "string" ? value.error : undefined;

    return {
        success: false,
        authenticated: false,
        error,
    };
}