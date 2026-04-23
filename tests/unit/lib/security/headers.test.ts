import { describe, it, expect } from "vitest";
import { buildSecurityHeaders } from "@/lib/security/headers";

describe("buildSecurityHeaders", () => {
    it("includes core security headers", () => {
        const headers = buildSecurityHeaders({ NODE_ENV: "production" } as NodeJS.ProcessEnv);
        const keys = headers.map((h) => h.key);

        expect(keys).toEqual(
            expect.arrayContaining([
                "Content-Security-Policy",
                "Strict-Transport-Security",
                "X-Content-Type-Options",
                "X-Frame-Options",
                "Referrer-Policy",
                "Permissions-Policy",
                "Cross-Origin-Opener-Policy",
                "Cross-Origin-Resource-Policy",
            ]),
        );
    });

    it("sets strict CSP values in production", () => {
        const headers = buildSecurityHeaders({ NODE_ENV: "production" } as NodeJS.ProcessEnv);
        const csp = headers.find((h) => h.key === "Content-Security-Policy")!.value;

        expect(csp).toContain("frame-ancestors 'none'");
        expect(csp).toContain("object-src 'none'");
        expect(csp).toContain("default-src 'self'");
        expect(csp).toContain("https://challenges.cloudflare.com");
        expect(csp).toContain("https://res.cloudinary.com");
        expect(csp).not.toContain("'unsafe-eval'");
    });

    it("allows 'unsafe-eval' for script-src only in development", () => {
        const headers = buildSecurityHeaders({ NODE_ENV: "development" } as NodeJS.ProcessEnv);
        const csp = headers.find((h) => h.key === "Content-Security-Policy")!.value;

        expect(csp).toContain("'unsafe-eval'");
    });

    it("returns immutable-like header set (fresh instance per call)", () => {
        const a = buildSecurityHeaders({ NODE_ENV: "production" } as NodeJS.ProcessEnv);
        const b = buildSecurityHeaders({ NODE_ENV: "production" } as NodeJS.ProcessEnv);
        expect(a).not.toBe(b);
        expect(a).toEqual(b);
    });
});
