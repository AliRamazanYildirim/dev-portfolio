import { describe, it, expect } from "vitest";
import {
    validateServerEnv,
    assertServerEnv,
    REQUIRED_SERVER_ENV_VARS,
} from "@/lib/security/env";

function baseEnv(): NodeJS.ProcessEnv {
    return {
        JWT_SECRET: "secret",
        MONGODB_URI: "mongodb://localhost/test",
        ADMIN_EMAIL: "admin@example.com",
        ADMIN_PASSWORD_HASH: "$2a$12$abc",
    } as unknown as NodeJS.ProcessEnv;
}

describe("validateServerEnv", () => {
    it("returns valid when all required vars are present", () => {
        expect(validateServerEnv(baseEnv())).toEqual({ valid: true, missing: [] });
    });

    it("reports every missing variable", () => {
        const env = baseEnv();
        delete env.JWT_SECRET;
        delete env.MONGODB_URI;

        const result = validateServerEnv(env);
        expect(result.valid).toBe(false);
        expect(result.missing).toEqual(
            expect.arrayContaining(["JWT_SECRET", "MONGODB_URI"]),
        );
    });

    it("treats empty/whitespace values as missing", () => {
        const env = baseEnv();
        env.JWT_SECRET = "   ";
        expect(validateServerEnv(env).missing).toContain("JWT_SECRET");
    });

    it("exposes a stable required list", () => {
        expect(REQUIRED_SERVER_ENV_VARS).toEqual([
            "JWT_SECRET",
            "MONGODB_URI",
            "ADMIN_EMAIL",
            "ADMIN_PASSWORD_HASH",
        ]);
    });
});

describe("assertServerEnv", () => {
    it("throws with a human-readable list when vars are missing", () => {
        const env = baseEnv();
        delete env.ADMIN_EMAIL;
        expect(() => assertServerEnv(env)).toThrow(/ADMIN_EMAIL/);
    });

    it("does not throw when all required vars are present", () => {
        expect(() => assertServerEnv(baseEnv())).not.toThrow();
    });
});
