/**
 * Contact API Utilities - HTTP Response Helpers
 */

import { NextResponse } from "next/server";
import { RateLimitMeta } from "./types";

/**
 * Fügt Rate Limit Header zu einer Response hinzu
 * @param response - NextResponse Object
 * @param meta - Rate Limit Meta Daten
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
 * Erstellt erfolgreiche API Response
 * @param data - Response Daten
 * @param message - Optionale Nachricht
 * @param status - HTTP Status Code (default: 200)
 */
export function successResponse(
    data: unknown,
    message?: string,
    status: number = 200
): NextResponse {
    return NextResponse.json(
        {
            success: true,
            data,
            ...(message && { message }),
        },
        { status }
    );
}

/**
 * Erstellt Error API Response
 * @param error - Error-Nachricht
 * @param status - HTTP Status Code (default: 500)
 */
export function errorResponse(error: string, status: number = 500): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error,
        },
        { status }
    );
}

/**
 * Erstellt Rate-Limited Error Response
 * @param meta - Rate Limit Meta Daten
 */
export function rateLimitedResponse(meta: RateLimitMeta): NextResponse {
    const retryAfter = Math.max(0, meta.reset - Math.floor(Date.now() / 1000));
    const response = errorResponse("Too many requests! Please try again later.", 429);
    response.headers.set("Retry-After", String(retryAfter));
    return attachRateLimitHeaders(response, meta);
}
