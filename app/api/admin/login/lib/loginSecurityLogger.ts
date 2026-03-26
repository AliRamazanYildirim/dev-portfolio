import type { LoginSecurityLogContext } from "../types";

function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!local || !domain) return "masked";

    const localPrefix = local.length > 2 ? local.slice(0, 2) : local[0] || "x";
    return `${localPrefix}***@${domain}`;
}

export function logLoginSecurityEvent(
    event: string,
    context: LoginSecurityLogContext,
): void {
    console.warn("admin_login_security_event", {
        event,
        ip: context.ip,
        emailMasked: maskEmail(context.email),
        policy: context.policy,
        remaining: context.remaining,
        reset: context.reset,
        timestamp: new Date().toISOString(),
    });
}

export function logTurnstileFailure(
    ip: string,
    email: string,
    errorCodes: string[],
): void {
    console.warn("admin_login_turnstile_failed", {
        ip,
        emailMasked: maskEmail(email),
        errorCodes,
        timestamp: new Date().toISOString(),
    });
}
