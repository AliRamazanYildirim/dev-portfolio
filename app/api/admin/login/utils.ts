import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-response";
import type { LoginRateLimitMeta, LoginRateLimitPolicy } from "./types";

export function attachRateLimitHeaders(
    response: NextResponse,
    meta: LoginRateLimitMeta,
    policy: LoginRateLimitPolicy,
): NextResponse {
    response.headers.set("X-RateLimit-Limit", String(meta.limit));
    response.headers.set("X-RateLimit-Remaining", String(meta.remaining));
    response.headers.set("X-RateLimit-Reset", String(meta.reset));
    response.headers.set("X-RateLimit-Policy", policy);
    return response;
}

export function rateLimitedResponse(
    meta: LoginRateLimitMeta,
    policy: LoginRateLimitPolicy,
    message = "Too many requests. Please try again later.",
): NextResponse {
    const retryAfter = Math.max(0, meta.reset - Math.floor(Date.now() / 1000));
    const response = errorResponse(message, 429);
    response.headers.set("Retry-After", String(retryAfter));
    return attachRateLimitHeaders(response, meta, policy);
}
