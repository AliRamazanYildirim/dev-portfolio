import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-response";
import type { RateLimitMeta } from "@/lib/mongoRateLimiter";
import type { ReferralValidateRateLimitPolicy } from "./rateLimit";

export function attachRateLimitHeaders(
    response: NextResponse,
    meta: RateLimitMeta,
    policy: ReferralValidateRateLimitPolicy,
): NextResponse {
    response.headers.set("X-RateLimit-Limit", String(meta.limit));
    response.headers.set("X-RateLimit-Remaining", String(meta.remaining));
    response.headers.set("X-RateLimit-Reset", String(meta.reset));
    response.headers.set("X-RateLimit-Policy", policy);
    return response;
}

export function rateLimitedResponse(
    meta: RateLimitMeta,
    policy: ReferralValidateRateLimitPolicy,
): NextResponse {
    const retryAfter = Math.max(0, meta.reset - Math.floor(Date.now() / 1000));
    const response = errorResponse("Too many requests. Please try again later.", 429);
    response.headers.set("Retry-After", String(retryAfter));
    return attachRateLimitHeaders(response, meta, policy);
}
