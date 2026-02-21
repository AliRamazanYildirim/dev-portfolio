/**
 * Contact API Utilities – Rate-Limit-spezifische Helfer.
 *
 * Allgemeine Response-Helfer (successResponse, errorResponse, handleError)
 * kommen ausschließlich aus @/lib/api-response (Cross-Cutting-Regel).
 */

import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-response";
import { RateLimitMeta } from "./types";

/**
 * Fügt Rate Limit Header zu einer Response hinzu
 */
export function attachRateLimitHeaders(
    response: NextResponse,
    meta: RateLimitMeta
): NextResponse {
    response.headers.set("X-RateLimit-Limit", String(meta.limit));
    response.headers.set("X-RateLimit-Remaining", String(meta.remaining));
    response.headers.set("X-RateLimit-Reset", String(meta.reset));
    return response;
}

/**
 * Erstellt Rate-Limited Error Response
 */
export function rateLimitedResponse(meta: RateLimitMeta): NextResponse {
    const retryAfter = Math.max(0, meta.reset - Math.floor(Date.now() / 1000));
    const response = errorResponse("Too many requests! Please try again later.", 429);
    response.headers.set("Retry-After", String(retryAfter));
    return attachRateLimitHeaders(response, meta);
}
