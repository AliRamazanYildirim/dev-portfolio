import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/referral/validate/route";
import {
  createJsonRequest,
  parseJsonResponse,
} from "@/tests/integration/helpers/httpTestUtils";

type ReferralValidateRateLimitPolicy =
  | "referral_validate_ip_window"
  | "referral_validate_code_ip_window";

interface ReferralValidateRateLimitDecision {
  allowed: boolean;
  policy: ReferralValidateRateLimitPolicy;
  meta: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

interface ReferralValidatePayload {
  success: boolean;
  error?: string;
  data?: {
    referrer: {
      name: string;
      referralCount: number;
    };
    discount: {
      rate: number;
      amount: number;
      originalPrice: number;
      finalPrice: number;
      referralLevel: number;
    };
  };
}

const mockRateLimit = vi.hoisted(() => ({
  createReferralValidateRequestContext: vi.fn(() => ({
    ip: "203.0.113.10",
    referralCode: "code-1",
  })),
  checkReferralValidateRateLimit: vi.fn(),
}));

const mockValidateReferral = vi.hoisted(() => vi.fn());

vi.mock("@/app/api/referral/validate/rateLimit", () => ({
  createReferralValidateRequestContext: mockRateLimit.createReferralValidateRequestContext,
  checkReferralValidateRateLimit: mockRateLimit.checkReferralValidateRateLimit,
}));

vi.mock("@/app/api/referral/validate/service", () => ({
  validateReferral: mockValidateReferral,
}));

function createDecision(
  allowed: boolean,
  policy: ReferralValidateRateLimitPolicy,
): ReferralValidateRateLimitDecision {
  return {
    allowed,
    policy,
    meta: {
      limit: 8,
      remaining: allowed ? 7 : 0,
      reset: Math.floor(Date.now() / 1000) + 60,
    },
  };
}

describe("referral validate route integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockRateLimit.checkReferralValidateRateLimit.mockResolvedValue(
      createDecision(true, "referral_validate_ip_window"),
    );

    mockValidateReferral.mockResolvedValue({
      referrer: {
        name: "Jane D.",
        referralCount: 2,
      },
      discount: {
        rate: 9,
        amount: 90,
        originalPrice: 1000,
        finalPrice: 910,
        referralLevel: 3,
      },
    });
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/referral/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{ invalid",
    });

    const response = await POST(request);
    const payload = await parseJsonResponse<ReferralValidatePayload>(response);

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Invalid JSON in request body");
  });

  it("returns 429 when referral validate limit is exceeded", async () => {
    mockRateLimit.checkReferralValidateRateLimit.mockResolvedValue(
      createDecision(false, "referral_validate_code_ip_window"),
    );

    const request = createJsonRequest(
      "http://localhost/api/referral/validate",
      "POST",
      {
        referralCode: "CODE_123",
        basePrice: 1000,
      },
    );

    const response = await POST(request);
    const payload = await parseJsonResponse<ReferralValidatePayload>(response);

    expect(response.status).toBe(429);
    expect(payload.success).toBe(false);
    expect(response.headers.get("X-RateLimit-Policy")).toBe(
      "referral_validate_code_ip_window",
    );
    expect(mockValidateReferral).not.toHaveBeenCalled();
  });

  it("returns 200 with discount payload for valid request", async () => {
    const request = createJsonRequest(
      "http://localhost/api/referral/validate",
      "POST",
      {
        referralCode: "CODE_123",
        basePrice: 1000,
      },
    );

    const response = await POST(request);
    const payload = await parseJsonResponse<ReferralValidatePayload>(response);

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data?.referrer.name).toBe("Jane D.");
    expect(payload.data?.discount.finalPrice).toBe(910);
    expect(response.headers.get("X-RateLimit-Policy")).toBe(
      "referral_validate_ip_window",
    );
    expect(mockValidateReferral).toHaveBeenCalledTimes(1);
  });
});
