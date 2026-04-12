import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { parseJsonResponse } from "@/tests/integration/helpers/httpTestUtils";

interface ProxyErrorPayload {
    success: boolean;
    error?: string;
}

const mockJwtVerify = vi.hoisted(() => vi.fn());

vi.mock("jose", () => ({
    jwtVerify: mockJwtVerify,
}));

async function importProxyModule() {
    vi.resetModules();
    (process.env as Record<string, string | undefined>).JWT_SECRET = "test-secret";
    return import("@/proxy");
}

describe("proxy auth boundaries", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockJwtVerify.mockResolvedValue({});
    });

    it("allows public login route without auth", async () => {
        const { proxy } = await importProxyModule();
        const request = new NextRequest("http://localhost/api/admin/login");

        const response = await proxy(request);

        expect(response.status).toBe(200);
        expect(response.headers.get("location")).toBeNull();
    });

    it("returns 401 for protected API route without auth cookie", async () => {
        const { proxy } = await importProxyModule();
        const request = new NextRequest("http://localhost/api/admin/customers");

        const response = await proxy(request);
        const payload = await parseJsonResponse<ProxyErrorPayload>(response);

        expect(response.status).toBe(401);
        expect(payload.success).toBe(false);
        expect(payload.error).toBe("Unauthorized");
    });

    it("redirects protected page route to login when unauthenticated", async () => {
        const { proxy } = await importProxyModule();
        const request = new NextRequest("http://localhost/admin/customers");

        const response = await proxy(request);
        const location = response.headers.get("location") || "";

        expect(response.status).toBe(307);
        expect(location).toContain("/admin/login");
        expect(location).toContain("from=%2Fadmin%2Fcustomers");
    });

    it("allows protected API route when auth cookie is valid", async () => {
        const { proxy } = await importProxyModule();
        const request = new NextRequest("http://localhost/api/admin/customers", {
            headers: {
                cookie: "admin-auth-token=valid-token",
            },
        });

        const response = await proxy(request);

        expect(response.status).toBe(200);
        expect(mockJwtVerify).toHaveBeenCalledTimes(1);
    });
});
