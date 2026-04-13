import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";
import {
  createJsonRequest,
  parseJsonResponse,
} from "@/tests/integration/helpers/httpTestUtils";

interface ContactRateLimitDecision {
  allowed: boolean;
  meta: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

interface ContactPayload {
  success: boolean;
  error?: string;
  data?: {
    id: string;
  };
}

const mockContactService = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
  createContact: vi.fn(),
}));

const mockValidateCreateContactRequest = vi.hoisted(() => vi.fn());

vi.mock("@/app/api/contact/service", () => ({
  ContactService: mockContactService,
}));

vi.mock("@/app/api/contact/validation", () => ({
  validateCreateContactRequest: mockValidateCreateContactRequest,
}));

function createDecision(allowed: boolean): ContactRateLimitDecision {
  return {
    allowed,
    meta: {
      limit: 3,
      remaining: allowed ? 2 : 0,
      reset: Math.floor(Date.now() / 1000) + 60,
    },
  };
}

describe("contact route integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockContactService.checkRateLimit.mockResolvedValue(createDecision(true));
    mockValidateCreateContactRequest.mockReturnValue({ valid: true });
    mockContactService.createContact.mockResolvedValue({
      success: true,
      data: { id: "contact-1" },
    });
  });

  it("returns 429 when contact rate limit is exceeded", async () => {
    mockContactService.checkRateLimit.mockResolvedValue(createDecision(false));

    const request = createJsonRequest("http://localhost/api/contact", "POST", {
      name: "John",
      email: "john@example.com",
      message: "Hi",
    }) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<ContactPayload>(response);

    expect(response.status).toBe(429);
    expect(payload.success).toBe(false);
    expect(response.headers.get("X-RateLimit-Limit")).toBe("3");
    expect(mockValidateCreateContactRequest).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{ invalid",
    }) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<ContactPayload>(response);

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Invalid JSON in request body");
  });

  it("returns 400 when payload validation fails", async () => {
    mockValidateCreateContactRequest.mockReturnValue({
      valid: false,
      error: "Validation failed",
    });

    const request = createJsonRequest("http://localhost/api/contact", "POST", {
      name: "",
      email: "john@example.com",
      message: "Hi",
    }) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<ContactPayload>(response);

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Validation failed");
    expect(response.headers.get("X-RateLimit-Limit")).toBe("3");
    expect(mockContactService.createContact).not.toHaveBeenCalled();
  });

  it("returns 201 for valid payload", async () => {
    const request = createJsonRequest("http://localhost/api/contact", "POST", {
      name: "John",
      email: "john@example.com",
      message: "Hi",
    }) as unknown as NextRequest;

    const response = await POST(request);
    const payload = await parseJsonResponse<ContactPayload>(response);

    expect(response.status).toBe(201);
    expect(payload.success).toBe(true);
    expect(payload.data?.id).toBe("contact-1");
    expect(response.headers.get("X-RateLimit-Limit")).toBe("3");
  });
});
