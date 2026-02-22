import type {
    AdminLoginResponse,
    AdminLoginSuccessResponse,
    AdminLoginUser,
} from "./types";

export type {
    AdminLoginFailureResponse,
    AdminLoginResponse,
    AdminLoginSuccessResponse,
    AdminLoginUser,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isAdminLoginUser(value: unknown): value is AdminLoginUser {
    if (!isRecord(value)) return false;

    return (
        typeof value.id === "string" &&
        typeof value.email === "string" &&
        typeof value.name === "string"
    );
}

export function createAdminLoginSuccessResponse(
    user: AdminLoginUser,
): AdminLoginSuccessResponse {
    return {
        success: true,
        message: "Successfully logged in",
        user,
    };
}

export function parseAdminLoginResponse(value: unknown): AdminLoginResponse {
    if (!isRecord(value)) {
        return { success: false, error: "invalid-response" };
    }

    if (
        value.success === true &&
        typeof value.message === "string" &&
        isAdminLoginUser(value.user)
    ) {
        return {
            success: true,
            message: value.message,
            user: value.user,
        };
    }

    return {
        success: false,
        error: typeof value.error === "string" ? value.error : undefined,
    };
}