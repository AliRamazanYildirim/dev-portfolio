import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "@/app/api/send-email/route";
import { ForbiddenError } from "@/lib/errors";
import {
    createJsonRequest,
    parseJsonResponse,
} from "@/tests/integration/helpers/httpTestUtils";

type SendEmailRateLimitPolicy =
    | "send_email_ip_window"
    | "send_email_fingerprint_window";

interface SendEmailRateLimitDecision {
    allowed: boolean;
    policy: SendEmailRateLimitPolicy;
    meta: {
        limit: number;
        remaining: number;
        reset: number;
    };
}

interface SendEmailPayload {
    success: boolean;
    error?: string;
    data?: {
        info: {
            messageId: string;
        };
    };
}

const mockRateLimit = vi.hoisted(() => ({
    createSendEmailRequestContext: vi.fn(() => ({
        ip: "203.0.113.11",
        fingerprint: "fp-123",
    })),
    checkSendEmailRateLimit: vi.fn(),
}));

const mockVerifySendEmailTurnstile = vi.hoisted(() => vi.fn());

const mockSendEmailService = vi.hoisted(() => ({
    sendContactEmail: vi.fn(),
}));

vi.mock("@/app/api/send-email/lib/rateLimit", () => ({
    createSendEmailRequestContext: mockRateLimit.createSendEmailRequestContext,
    checkSendEmailRateLimit: mockRateLimit.checkSendEmailRateLimit,
}));

vi.mock("@/app/api/send-email/lib/turnstileVerifier", () => ({
    verifySendEmailTurnstile: mockVerifySendEmailTurnstile,
}));

vi.mock("@/app/api/send-email/service", () => ({
    SendEmailService: mockSendEmailService,
}));

function createDecision(
    allowed: boolean,
    policy: SendEmailRateLimitPolicy,
): SendEmailRateLimitDecision {
    return {
        allowed,
        policy,
        meta: {
            limit: 5,
            remaining: allowed ? 4 : 0,
            reset: Math.floor(Date.now() / 1000) + 60,
        },
    };
}

describe("send-email route integration", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockRateLimit.checkSendEmailRateLimit.mockResolvedValue(
            createDecision(true, "send_email_ip_window"),
        );
        mockVerifySendEmailTurnstile.mockResolvedValue(undefined);
        mockSendEmailService.sendContactEmail.mockResolvedValue({
            messageId: "mail-1",
        });
    });

    it("returns 429 when send-email rate limit is exceeded", async () => {
        mockRateLimit.checkSendEmailRateLimit.mockResolvedValue(
            createDecision(false, "send_email_fingerprint_window"),
        );

        const request = createJsonRequest(
            "http://localhost/api/send-email",
            "POST",
            {
                name: "John",
                email: "john@example.com",
                message: "Hi",
            },
        ) as unknown as NextRequest;

        const response = await POST(request);
        const payload = await parseJsonResponse<SendEmailPayload>(response);

        expect(response.status).toBe(429);
        expect(payload.success).toBe(false);
        expect(response.headers.get("X-RateLimit-Policy")).toBe(
            "send_email_fingerprint_window",
        );
        expect(mockVerifySendEmailTurnstile).not.toHaveBeenCalled();
        expect(mockSendEmailService.sendContactEmail).not.toHaveBeenCalled();
    });

    it("returns 403 when turnstile verification fails", async () => {
        mockVerifySendEmailTurnstile.mockRejectedValue(
            new ForbiddenError("Security verification failed"),
        );

        const request = createJsonRequest(
            "http://localhost/api/send-email",
            "POST",
            {
                name: "John",
                email: "john@example.com",
                message: "Hi",
                turnstileToken: "token",
            },
        ) as unknown as NextRequest;

        const response = await POST(request);
        const payload = await parseJsonResponse<SendEmailPayload>(response);

        expect(response.status).toBe(403);
        expect(payload.success).toBe(false);
        expect(payload.error).toBe("Security verification failed");
        expect(response.headers.get("X-RateLimit-Policy")).toBe("send_email_ip_window");
        expect(mockSendEmailService.sendContactEmail).not.toHaveBeenCalled();
    });

    it("returns 200 for valid payload", async () => {
        const request = createJsonRequest(
            "http://localhost/api/send-email",
            "POST",
            {
                name: "John",
                email: "john@example.com",
                message: "Hi",
                turnstileToken: "token",
            },
        ) as unknown as NextRequest;

        const response = await POST(request);
        const payload = await parseJsonResponse<SendEmailPayload>(response);

        expect(response.status).toBe(200);
        expect(payload.success).toBe(true);
        expect(payload.data?.info.messageId).toBe("mail-1");
        expect(response.headers.get("X-RateLimit-Policy")).toBe("send_email_ip_window");
        expect(mockVerifySendEmailTurnstile).toHaveBeenCalledTimes(1);
        expect(mockSendEmailService.sendContactEmail).toHaveBeenCalledTimes(1);
    });
});
