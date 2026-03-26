export interface LoginRequest {
    email: string;
    password: string;
    turnstileToken?: string;
}

export interface LoginAttemptContext {
    ip: string;
    email: string;
}

export interface LoginRateLimitMeta {
    limit: number;
    remaining: number;
    reset: number;
}

export type LoginRateLimitPolicy =
    | "login_ip_window"
    | "login_email_ip_window"
    | "login_failed_attempt_lock"
    | "login_exponential_backoff";

export interface LoginRateLimitDecision {
    allowed: boolean;
    policy: LoginRateLimitPolicy;
    meta: LoginRateLimitMeta;
}

export interface LoginSecurityLogContext {
    ip: string;
    email: string;
    policy: LoginRateLimitPolicy;
    remaining: number;
    reset: number;
}
