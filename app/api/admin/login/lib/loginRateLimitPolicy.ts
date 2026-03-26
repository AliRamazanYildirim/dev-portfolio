import {
    checkRateLimitKey,
    getRateLimitKeyStatus,
    resetRateLimitKey,
    setRateLimitKeyWindow,
    type RateLimitMeta,
} from "@/lib/mongoRateLimiter";
import type {
    LoginAttemptContext,
    LoginRateLimitDecision,
    LoginRateLimitPolicy,
} from "../types";
import {
    getLoginBackoffKey,
    getLoginEmailIpKey,
    getLoginFailedLockKey,
    getLoginIpKey,
} from "./loginRateLimitKeys";
import {
    type LoginSecurityConfig,
    loginSecurityConfig,
} from "./loginSecurityConfig";
import { logLoginSecurityEvent } from "./loginSecurityLogger";

function toDecision(
    policy: LoginRateLimitPolicy,
    allowed: boolean,
    meta: RateLimitMeta,
): LoginRateLimitDecision {
    return {
        allowed,
        policy,
        meta,
    };
}

function pickMostRestrictiveMeta(
    left: RateLimitMeta,
    right: RateLimitMeta,
): RateLimitMeta {
    if (left.remaining !== right.remaining) {
        return left.remaining < right.remaining ? left : right;
    }

    return left.reset < right.reset ? left : right;
}

function calculateBackoffSeconds(
    failedAttempts: number,
    config: LoginSecurityConfig,
): number {
    const safeAttempts = Math.max(1, failedAttempts);
    const exponent = safeAttempts - 1;
    const dynamicSeconds = config.backoff.baseSeconds * (2 ** exponent);
    return Math.min(config.backoff.maxSeconds, dynamicSeconds);
}

export async function checkRequestRateLimit(
    context: LoginAttemptContext,
    config: LoginSecurityConfig = loginSecurityConfig,
): Promise<LoginRateLimitDecision> {
    const ipResult = await checkRateLimitKey(
        getLoginIpKey(context),
        config.ipWindow.windowSec,
        config.ipWindow.limit,
    );

    if (!ipResult.allowed) {
        const decision = toDecision("login_ip_window", false, ipResult.meta);
        logLoginSecurityEvent("blocked", {
            ip: context.ip,
            email: context.email,
            policy: decision.policy,
            remaining: decision.meta.remaining,
            reset: decision.meta.reset,
        });
        return decision;
    }

    const emailIpResult = await checkRateLimitKey(
        getLoginEmailIpKey(context),
        config.emailIpWindow.windowSec,
        config.emailIpWindow.limit,
    );

    if (!emailIpResult.allowed) {
        const decision = toDecision("login_email_ip_window", false, emailIpResult.meta);
        logLoginSecurityEvent("blocked", {
            ip: context.ip,
            email: context.email,
            policy: decision.policy,
            remaining: decision.meta.remaining,
            reset: decision.meta.reset,
        });
        return decision;
    }

    const combinedMeta = pickMostRestrictiveMeta(ipResult.meta, emailIpResult.meta);
    const policy: LoginRateLimitPolicy =
        combinedMeta.remaining === emailIpResult.meta.remaining &&
            combinedMeta.reset === emailIpResult.meta.reset
            ? "login_email_ip_window"
            : "login_ip_window";

    return toDecision(policy, true, combinedMeta);
}

export async function checkFailedLock(
    context: LoginAttemptContext,
    config: LoginSecurityConfig = loginSecurityConfig,
): Promise<LoginRateLimitDecision> {
    const status = await getRateLimitKeyStatus(
        getLoginFailedLockKey(context),
        config.failedLock.windowSec,
        config.failedLock.limit,
    );

    const decision = toDecision("login_failed_attempt_lock", status.allowed, status.meta);
    if (!decision.allowed) {
        logLoginSecurityEvent("locked", {
            ip: context.ip,
            email: context.email,
            policy: decision.policy,
            remaining: decision.meta.remaining,
            reset: decision.meta.reset,
        });
    }

    return decision;
}

export async function checkExponentialBackoff(
    context: LoginAttemptContext,
    config: LoginSecurityConfig = loginSecurityConfig,
): Promise<LoginRateLimitDecision> {
    const status = await getRateLimitKeyStatus(
        getLoginBackoffKey(context),
        config.backoff.maxSeconds,
        1,
    );

    const decision = toDecision("login_exponential_backoff", status.allowed, status.meta);
    if (!decision.allowed) {
        logLoginSecurityEvent("backoff_active", {
            ip: context.ip,
            email: context.email,
            policy: decision.policy,
            remaining: decision.meta.remaining,
            reset: decision.meta.reset,
        });
    }

    return decision;
}

export async function registerFailedAttempt(
    context: LoginAttemptContext,
    config: LoginSecurityConfig = loginSecurityConfig,
): Promise<LoginRateLimitDecision> {
    const result = await checkRateLimitKey(
        getLoginFailedLockKey(context),
        config.failedLock.windowSec,
        config.failedLock.limit,
    );

    const decision = toDecision("login_failed_attempt_lock", result.allowed, result.meta);
    logLoginSecurityEvent(result.allowed ? "failed_attempt" : "locked", {
        ip: context.ip,
        email: context.email,
        policy: decision.policy,
        remaining: decision.meta.remaining,
        reset: decision.meta.reset,
    });

    return decision;
}

export async function applyExponentialBackoff(
    context: LoginAttemptContext,
    failedAttemptDecision: LoginRateLimitDecision,
    config: LoginSecurityConfig = loginSecurityConfig,
): Promise<LoginRateLimitDecision> {
    const failedAttempts = Math.max(
        1,
        failedAttemptDecision.meta.limit - failedAttemptDecision.meta.remaining,
    );

    const backoffSeconds = calculateBackoffSeconds(failedAttempts, config);
    const result = await setRateLimitKeyWindow(
        getLoginBackoffKey(context),
        backoffSeconds,
    );

    const decision = toDecision("login_exponential_backoff", false, result.meta);
    logLoginSecurityEvent("backoff_set", {
        ip: context.ip,
        email: context.email,
        policy: decision.policy,
        remaining: decision.meta.remaining,
        reset: decision.meta.reset,
    });

    return decision;
}

export async function resetFailedAttempts(
    context: LoginAttemptContext,
): Promise<void> {
    await Promise.all([
        resetRateLimitKey(getLoginFailedLockKey(context)),
        resetRateLimitKey(getLoginBackoffKey(context)),
    ]);
}
