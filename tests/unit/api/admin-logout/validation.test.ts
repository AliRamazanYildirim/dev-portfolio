import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";
import { validateLogoutRequest } from "@/app/api/admin/logout/validation";
import { ValidationError } from "@/lib/errors";

function createRequest(method: string): NextRequest {
    return { method } as unknown as NextRequest;
}

describe("admin logout validation", () => {
    it("throws for non-POST methods", () => {
        expect(() => validateLogoutRequest(createRequest("GET"))).toThrow(ValidationError);
        expect(() => validateLogoutRequest(createRequest("PUT"))).toThrow("Method not allowed");
    });

    it("accepts POST method", () => {
        expect(() => validateLogoutRequest(createRequest("POST"))).not.toThrow();
    });
});
