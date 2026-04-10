import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    attachRateLimitHeaders,
    rateLimitedResponse,
} from "@/app/api/referral/validate/utils";
import { NextResponse } from "next/server";
import type { RateLimitMeta } from "@/lib/mongoRateLimiter";

describe("referral validate rate-limit helpers", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-04-10T00:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("adds rate-limit headers to a response", () => {
        const response = NextResponse.json({ ok: true });
        const meta: RateLimitMeta = {
            limit: 20,
            remaining: 19,
            reset: Math.floor(Date.now() / 1000) + 60,
        };

        const enriched = attachRateLimitHeaders(
            response,
            meta,
            "referral_validate_ip_window",
        );

        expect(enriched.headers.get("X-RateLimit-Limit")).toBe("20");
        expect(enriched.headers.get("X-RateLimit-Remaining")).toBe("19");
        expect(enriched.headers.get("X-RateLimit-Policy")).toBe(
            "referral_validate_ip_window",
        );
    });

    it("builds a 429 response with retry-after", () => {
        const meta: RateLimitMeta = {
            limit: 8,
            remaining: 0,
            reset: Math.floor(Date.now() / 1000) + 120,
        };

        const response = rateLimitedResponse(meta, "referral_validate_code_ip_window");

        expect(response.status).toBe(429);
        expect(response.headers.get("Retry-After")).toBe("120");
        expect(response.headers.get("X-RateLimit-Policy")).toBe(
            "referral_validate_code_ip_window",
        );
    });
});
