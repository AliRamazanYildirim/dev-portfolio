import type { LoginAttemptContext } from "../types";

export function getLoginIpKey(context: LoginAttemptContext): string {
    return `auth:login:ip:${context.ip}`;
}

export function getLoginEmailIpKey(context: LoginAttemptContext): string {
    return `auth:login:email:${context.email}:ip:${context.ip}`;
}

export function getLoginFailedLockKey(context: LoginAttemptContext): string {
    return `auth:login:failed:${context.email}:ip:${context.ip}`;
}

export function getLoginBackoffKey(context: LoginAttemptContext): string {
    return `auth:login:backoff:${context.email}:ip:${context.ip}`;
}
