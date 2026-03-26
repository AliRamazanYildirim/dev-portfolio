export interface LoginSecurityConfig {
    ipWindow: {
        limit: number;
        windowSec: number;
    };
    emailIpWindow: {
        limit: number;
        windowSec: number;
    };
    failedLock: {
        limit: number;
        windowSec: number;
    };
    backoff: {
        baseSeconds: number;
        maxSeconds: number;
    };
    turnstile: {
        enabled: boolean;
        verifyTimeoutMs: number;
    };
}

const LOGIN_SECURITY_DEFAULTS = {
    LOGIN_IP_WINDOW_LIMIT: 20,
    LOGIN_IP_WINDOW_SECONDS: 600,
    LOGIN_EMAIL_IP_WINDOW_LIMIT: 8,
    LOGIN_EMAIL_IP_WINDOW_SECONDS: 600,
    LOGIN_FAILED_LOCK_LIMIT: 10,
    LOGIN_FAILED_LOCK_WINDOW_SECONDS: 900,
    LOGIN_BACKOFF_BASE_SECONDS: 2,
    LOGIN_BACKOFF_MAX_SECONDS: 120,
    TURNSTILE_VERIFY_TIMEOUT_MS: 8000,
} as const;

function readPositiveInt(name: keyof typeof LOGIN_SECURITY_DEFAULTS): number {
    const raw = process.env[name];
    const parsed = Number(raw);

    if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
    }

    return LOGIN_SECURITY_DEFAULTS[name];
}

export const loginSecurityConfig: LoginSecurityConfig = {
    ipWindow: {
        limit: readPositiveInt("LOGIN_IP_WINDOW_LIMIT"),
        windowSec: readPositiveInt("LOGIN_IP_WINDOW_SECONDS"),
    },
    emailIpWindow: {
        limit: readPositiveInt("LOGIN_EMAIL_IP_WINDOW_LIMIT"),
        windowSec: readPositiveInt("LOGIN_EMAIL_IP_WINDOW_SECONDS"),
    },
    failedLock: {
        limit: readPositiveInt("LOGIN_FAILED_LOCK_LIMIT"),
        windowSec: readPositiveInt("LOGIN_FAILED_LOCK_WINDOW_SECONDS"),
    },
    backoff: {
        baseSeconds: readPositiveInt("LOGIN_BACKOFF_BASE_SECONDS"),
        maxSeconds: readPositiveInt("LOGIN_BACKOFF_MAX_SECONDS"),
    },
    turnstile: {
        enabled: process.env.TURNSTILE_ENABLED === "true",
        verifyTimeoutMs: readPositiveInt("TURNSTILE_VERIFY_TIMEOUT_MS"),
    },
};
