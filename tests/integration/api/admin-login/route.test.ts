import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/login/route";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import {
  createJsonRequest,
  parseJsonResponse,
} from "@/tests/integration/helpers/httpTestUtils";

type LoginRateLimitPolicy =
  | "login_ip_window"
  | "login_email_ip_window"
  | "login_failed_attempt_lock"
  | "login_exponential_backoff";

interface LoginRateLimitDecision {
  allowed: boolean;
  policy: LoginRateLimitPolicy;
  meta: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

interface LoginSuccessPayload {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

const mockGetIpFromHeaders = vi.hoisted(() => vi.fn(() => "203.0.113.10"));

const mockAdminLoginService = vi.hoisted(() => ({
  normalizeEmail: vi.fn((email: string) => email.toLowerCase().trim()),
  checkRequestRateLimit: vi.fn(),
  checkFailedLock: vi.fn(),
  checkExponentialBackoff: vi.fn(),
  verifyTurnstile: vi.fn(),
  login: vi.fn(),
  resetFailedAttempts: vi.fn(),
  registerFailedAttempt: vi.fn(),
  applyExponentialBackoff: vi.fn(),
}));

const mockAuthService = vi.hoisted(() => ({
  cookieName: "admin-auth-token",
  cookieOptions: {
    httpOnly: true,
    secure: false,
    sameSite: "strict" as const,
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  },
}));

vi.mock("@/lib/ip", () => ({
  getIpFromHeaders: mockGetIpFromHeaders,
}));

vi.mock("@/app/api/admin/login/service", () => ({
  AdminLoginService: mockAdminLoginService,
}));

vi.mock("@/app/api/admin/auth/service", () => ({
  AuthService: mockAuthService,
}));

function createDecision(
  allowed: boolean,
  policy: LoginRateLimitPolicy,
): LoginRateLimitDecision {
  return {
    allowed,
    policy,
    meta: {
      limit: 20,
      remaining: allowed ? 19 : 0,
      reset: Math.floor(Date.now() / 1000) + 60,
    },
  };
}

describe("admin login route integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockAdminLoginService.checkRequestRateLimit.mockResolvedValue(
      createDecision(true, "login_ip_window"),
    );
    mockAdminLoginService.checkFailedLock.mockResolvedValue(
      createDecision(true, "login_failed_attempt_lock"),
    );
    mockAdminLoginService.checkExponentialBackoff.mockResolvedValue(
      createDecision(true, "login_exponential_backoff"),
    );
    mockAdminLoginService.verifyTurnstile.mockResolvedValue(undefined);
    mockAdminLoginService.resetFailedAttempts.mockResolvedValue(undefined);
    mockAdminLoginService.registerFailedAttempt.mockResolvedValue(
      createDecision(true, "login_failed_attempt_lock"),
    );
    mockAdminLoginService.applyExponentialBackoff.mockResolvedValue(
      createDecision(false, "login_exponential_backoff"),
    );
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{ invalid",
    }) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<LoginSuccessPayload>(response);

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Invalid JSON in request body");
  });

  it("returns 429 when request rate limit is exceeded", async () => {
    mockAdminLoginService.checkRequestRateLimit.mockResolvedValue(
      createDecision(false, "login_ip_window"),
    );

    const request = createJsonRequest(
      "http://localhost/api/admin/login",
      "POST",
      {
        email: "admin@example.com",
        password: "secret",
      },
    ) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<LoginSuccessPayload>(response);

    expect(response.status).toBe(429);
    expect(payload.success).toBe(false);
    expect(response.headers.get("X-RateLimit-Policy")).toBe("login_ip_window");
    expect(mockAdminLoginService.checkFailedLock).not.toHaveBeenCalled();
  });

  it("returns 200 and sets auth cookie for valid credentials", async () => {
    mockAdminLoginService.login.mockResolvedValue({
      token: "jwt-token",
      user: {
        id: "admin-1",
        email: "admin@example.com",
        name: "Admin",
      },
    });

    const request = createJsonRequest(
      "http://localhost/api/admin/login",
      "POST",
      {
        email: "admin@example.com",
        password: "secret",
      },
    ) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<LoginSuccessPayload>(response);

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.user?.email).toBe("admin@example.com");
    expect(response.headers.get("X-RateLimit-Policy")).toBe("login_ip_window");
    expect(response.headers.get("set-cookie") || "").toContain("admin-auth-token=jwt-token");
    expect(mockAdminLoginService.resetFailedAttempts).toHaveBeenCalledTimes(1);
  });

  it("returns 401 and applies backoff on invalid credentials", async () => {
    mockAdminLoginService.login.mockRejectedValue(
      new UnauthorizedError("Invalid credentials"),
    );

    const request = createJsonRequest(
      "http://localhost/api/admin/login",
      "POST",
      {
        email: "admin@example.com",
        password: "wrong-secret",
      },
    ) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<LoginSuccessPayload>(response);

    expect(response.status).toBe(401);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Invalid credentials");
    expect(response.headers.get("X-RateLimit-Policy")).toBe(
      "login_exponential_backoff",
    );
    expect(mockAdminLoginService.registerFailedAttempt).toHaveBeenCalledTimes(1);
    expect(mockAdminLoginService.applyExponentialBackoff).toHaveBeenCalledTimes(1);
    expect(mockAdminLoginService.resetFailedAttempts).not.toHaveBeenCalled();
  });

  it("returns 403 when turnstile verification fails", async () => {
    mockAdminLoginService.verifyTurnstile.mockRejectedValue(
      new ForbiddenError("Security verification failed"),
    );

    const request = createJsonRequest(
      "http://localhost/api/admin/login",
      "POST",
      {
        email: "admin@example.com",
        password: "secret",
      },
    ) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<LoginSuccessPayload>(response);

    expect(response.status).toBe(403);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Security verification failed");
    expect(mockAdminLoginService.login).not.toHaveBeenCalled();
  });
});
