import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/logout/route";
import { parseJsonResponse } from "@/tests/integration/helpers/httpTestUtils";

interface LogoutPayload {
  success: boolean;
  message?: string;
  error?: string;
}

const mockAdminLogoutService = vi.hoisted(() => ({
  buildPayload: vi.fn(() => ({ success: true, message: "Logged out" })),
  getCookieName: vi.fn(() => "admin-auth-token"),
  getExpiredCookieOptions: vi.fn(() => ({
    httpOnly: true,
    secure: false,
    sameSite: "strict" as const,
    path: "/",
    expires: new Date(0),
  })),
}));

vi.mock("@/app/api/admin/logout/service", () => ({
  AdminLogoutService: mockAdminLogoutService,
}));

describe("admin logout route integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when request method is not POST", async () => {
    const request = new Request("http://localhost/api/admin/logout", {
      method: "GET",
    }) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<LogoutPayload>(response);

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Method not allowed");
    expect(mockAdminLogoutService.buildPayload).not.toHaveBeenCalled();
  });

  it("returns 200 and clears auth cookie for POST", async () => {
    const request = new Request("http://localhost/api/admin/logout", {
      method: "POST",
    }) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<LogoutPayload>(response);

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(response.headers.get("set-cookie") || "").toContain("admin-auth-token=");
    expect(mockAdminLogoutService.getCookieName).toHaveBeenCalledTimes(1);
    expect(mockAdminLogoutService.buildPayload).toHaveBeenCalledTimes(1);
  });
});
