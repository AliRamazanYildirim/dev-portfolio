import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@/lib/errors";
import { verifyTurnstile } from "@/app/api/admin/login/lib/turnstileVerifier";
import type { LoginSecurityConfig } from "@/app/api/admin/login/lib/loginSecurityConfig";
import type { LoginAttemptContext } from "@/app/api/admin/login/types";

const mockLogTurnstileFailure = vi.hoisted(() => vi.fn());

vi.mock("@/app/api/admin/login/lib/loginSecurityLogger", () => ({
  logTurnstileFailure: mockLogTurnstileFailure,
}));

const ORIGINAL_TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const ORIGINAL_FETCH = globalThis.fetch;

const CONTEXT: LoginAttemptContext = {
  ip: "203.0.113.12",
  email: "admin@example.com",
};

function createConfig(enabled: boolean): LoginSecurityConfig {
  return {
    ipWindow: { limit: 20, windowSec: 600 },
    emailIpWindow: { limit: 8, windowSec: 600 },
    failedLock: { limit: 10, windowSec: 900 },
    backoff: { baseSeconds: 2, maxSeconds: 120 },
    turnstile: {
      enabled,
      verifyTimeoutMs: 500,
    },
  };
}

function setFetchMock(implementation: () => Promise<Response>): void {
  globalThis.fetch = vi.fn(implementation) as unknown as typeof fetch;
}

describe("admin login turnstile verifier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    setFetchMock(async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  afterEach(() => {
    if (ORIGINAL_TURNSTILE_SECRET_KEY === undefined) {
      delete process.env.TURNSTILE_SECRET_KEY;
    } else {
      process.env.TURNSTILE_SECRET_KEY = ORIGINAL_TURNSTILE_SECRET_KEY;
    }

    globalThis.fetch = ORIGINAL_FETCH;
  });

  it("skips verification when turnstile is disabled", async () => {
    await expect(
      verifyTurnstile(CONTEXT, undefined, createConfig(false)),
    ).resolves.toBeUndefined();

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("throws when secret is missing while turnstile is enabled", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;

    await expect(
      verifyTurnstile(CONTEXT, "token", createConfig(true)),
    ).rejects.toThrow("TURNSTILE_SECRET_KEY is required when TURNSTILE_ENABLED=true");
  });

  it("throws ForbiddenError when token is missing", async () => {
    await expect(
      verifyTurnstile(CONTEXT, undefined, createConfig(true)),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("throws ForbiddenError and logs failure when verify response is unsuccessful", async () => {
    setFetchMock(async () =>
      new Response(
        JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await expect(
      verifyTurnstile(CONTEXT, "token", createConfig(true)),
    ).rejects.toBeInstanceOf(ForbiddenError);

    expect(mockLogTurnstileFailure).toHaveBeenCalledWith(
      "203.0.113.12",
      "admin@example.com",
      ["invalid-input-response"],
    );
  });

  it("resolves when turnstile verify is successful", async () => {
    await expect(
      verifyTurnstile(CONTEXT, "token", createConfig(true)),
    ).resolves.toBeUndefined();

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(mockLogTurnstileFailure).not.toHaveBeenCalled();
  });
});
