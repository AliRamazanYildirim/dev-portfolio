import { describe, it, expect } from "vitest";
import {
    generateCsrfToken,
    verifyCsrfTokenPair,
    CSRF_COOKIE_NAME,
    CSRF_HEADER_NAME,
} from "@/lib/security/csrf";

describe("csrf token", () => {
    it("generates unique URL-safe tokens", () => {
        const a = generateCsrfToken();
        const b = generateCsrfToken();
        expect(a).not.toBe(b);
        expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
        expect(a.length).toBeGreaterThanOrEqual(32);
    });

    it("accepts matching tokens", () => {
        const token = generateCsrfToken();
        expect(verifyCsrfTokenPair(token, token)).toBe(true);
    });

    it("rejects mismatched tokens", () => {
        expect(verifyCsrfTokenPair(generateCsrfToken(), generateCsrfToken())).toBe(false);
    });

    it("rejects empty or missing tokens", () => {
        expect(verifyCsrfTokenPair(null, null)).toBe(false);
        expect(verifyCsrfTokenPair("", "")).toBe(false);
        expect(verifyCsrfTokenPair("abc", null)).toBe(false);
        expect(verifyCsrfTokenPair(undefined, "abc")).toBe(false);
    });

    it("rejects tokens exceeding the max length", () => {
        const oversize = "a".repeat(200);
        expect(verifyCsrfTokenPair(oversize, oversize)).toBe(false);
    });

    it("exposes stable cookie and header names", () => {
        expect(CSRF_COOKIE_NAME).toBe("csrf-token");
        expect(CSRF_HEADER_NAME).toBe("x-csrf-token");
    });
});
