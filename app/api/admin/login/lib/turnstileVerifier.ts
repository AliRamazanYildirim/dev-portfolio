import { ForbiddenError } from "@/lib/errors";
import type { LoginAttemptContext } from "../types";
import {
    type LoginSecurityConfig,
    loginSecurityConfig,
} from "./loginSecurityConfig";
import { logTurnstileFailure } from "./loginSecurityLogger";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerificationResult = {
    success: boolean;
    errorCodes: string[];
};

function parseTurnstilePayload(payload: unknown): TurnstileVerificationResult {
    if (!payload || typeof payload !== "object") {
        return { success: false, errorCodes: ["invalid-response"] };
    }

    const raw = payload as {
        success?: unknown;
        "error-codes"?: unknown;
    };

    const errorCodes = Array.isArray(raw["error-codes"])
        ? raw["error-codes"].filter(
            (entry): entry is string => typeof entry === "string",
        )
        : [];

    return {
        success: raw.success === true,
        errorCodes,
    };
}

export async function verifyTurnstile(
    context: LoginAttemptContext,
    token: string | undefined,
    config: LoginSecurityConfig = loginSecurityConfig,
): Promise<void> {
    if (!config.turnstile.enabled) {
        return;
    }

    const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
    if (!secret) {
        throw new Error("TURNSTILE_SECRET_KEY is required when TURNSTILE_ENABLED=true");
    }

    if (!token) {
        throw new ForbiddenError("Security verification failed");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
        () => controller.abort(),
        config.turnstile.verifyTimeoutMs,
    );

    try {
        const body = new URLSearchParams({
            secret,
            response: token,
            remoteip: context.ip,
        });

        const response = await fetch(TURNSTILE_VERIFY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
            cache: "no-store",
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Turnstile verify failed: HTTP ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const verifyResult = parseTurnstilePayload(payload);

        if (!verifyResult.success) {
            logTurnstileFailure(context.ip, context.email, verifyResult.errorCodes);
            throw new ForbiddenError("Security verification failed");
        }
    } finally {
        clearTimeout(timeoutId);
    }
}
