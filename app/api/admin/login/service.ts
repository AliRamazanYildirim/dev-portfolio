import { AuthService, type LoginResult } from "@/app/api/admin/auth/service";
import type {
    LoginAttemptContext,
    LoginRateLimitDecision,
    LoginRequest,
} from "./types";
import { loginSecurityConfig } from "./lib/loginSecurityConfig";
import {
    applyExponentialBackoff,
    checkExponentialBackoff,
    checkFailedLock,
    checkRequestRateLimit,
    registerFailedAttempt,
    resetFailedAttempts,
} from "./lib/loginRateLimitPolicy";
import { verifyTurnstile } from "./lib/turnstileVerifier";

export class AdminLoginService {
    static normalizeEmail(email: string): string {
        return email.toLowerCase().trim();
    }

    static async checkRequestRateLimit(context: LoginAttemptContext): Promise<LoginRateLimitDecision> {
        return checkRequestRateLimit(context, loginSecurityConfig);
    }

    static async checkFailedLock(context: LoginAttemptContext): Promise<LoginRateLimitDecision> {
        return checkFailedLock(context, loginSecurityConfig);
    }

    static async checkExponentialBackoff(context: LoginAttemptContext): Promise<LoginRateLimitDecision> {
        return checkExponentialBackoff(context, loginSecurityConfig);
    }

    static async registerFailedAttempt(context: LoginAttemptContext): Promise<LoginRateLimitDecision> {
        return registerFailedAttempt(context, loginSecurityConfig);
    }

    static async applyExponentialBackoff(
        context: LoginAttemptContext,
        failedAttemptDecision: LoginRateLimitDecision,
    ): Promise<LoginRateLimitDecision> {
        return applyExponentialBackoff(context, failedAttemptDecision, loginSecurityConfig);
    }

    static async verifyTurnstile(
        context: LoginAttemptContext,
        token: string | undefined,
    ): Promise<void> {
        await verifyTurnstile(context, token, loginSecurityConfig);
    }

    static async resetFailedAttempts(context: LoginAttemptContext): Promise<void> {
        await resetFailedAttempts(context);
    }

    static login(input: LoginRequest): Promise<LoginResult> {
        return AuthService.login(input.email, input.password);
    }
}
