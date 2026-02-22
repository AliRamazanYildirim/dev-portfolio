import type {
    AdminLogoutResponse,
    AdminLogoutSuccessResponse,
} from "./types";

export type {
    AdminLogoutFailureResponse,
    AdminLogoutResponse,
    AdminLogoutSuccessResponse,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function createAdminLogoutSuccessResponse(): AdminLogoutSuccessResponse {
    return {
        success: true,
        message: "Successfully logged out",
    };
}

export function parseAdminLogoutResponse(value: unknown): AdminLogoutResponse {
    if (!isRecord(value)) {
        return { success: false, error: "invalid-response" };
    }

    if (value.success === true && typeof value.message === "string") {
        return {
            success: true,
            message: value.message,
        };
    }

    return {
        success: false,
        error: typeof value.error === "string" ? value.error : undefined,
    };
}