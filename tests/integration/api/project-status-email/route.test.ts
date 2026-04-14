import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/project-status-email/route";
import {
    createJsonRequest,
    parseJsonResponse,
} from "@/tests/integration/helpers/httpTestUtils";

interface ProjectStatusPayload {
    success: boolean;
    error?: string;
    data?: {
        sent: boolean;
    };
}

const mockProjectStatusEmailService = vi.hoisted(() => ({
    send: vi.fn(),
}));

vi.mock("@/app/api/project-status-email/service", () => ({
    ProjectStatusEmailService: mockProjectStatusEmailService,
}));

describe("project status email route integration", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockProjectStatusEmailService.send.mockResolvedValue({ sent: true });
    });

    it("returns 400 for invalid client email", async () => {
        const request = createJsonRequest(
            "http://localhost/api/project-status-email",
            "POST",
            {
                clientName: "Client",
                clientEmail: "invalid-email",
                status: "gestart",
            },
        );

        const response = await POST(request);
        const payload = await parseJsonResponse<ProjectStatusPayload>(response);

        expect(response.status).toBe(400);
        expect(payload.success).toBe(false);
        expect(payload.error).toBe("Client email format is invalid");
        expect(mockProjectStatusEmailService.send).not.toHaveBeenCalled();
    });

    it("returns 400 for invalid CTA URL", async () => {
        const request = createJsonRequest(
            "http://localhost/api/project-status-email",
            "POST",
            {
                clientName: "Client",
                clientEmail: "client@example.com",
                status: "gestart",
                ctaUrl: "javascript:alert(1)",
            },
        );

        const response = await POST(request);
        const payload = await parseJsonResponse<ProjectStatusPayload>(response);

        expect(response.status).toBe(400);
        expect(payload.success).toBe(false);
        expect(payload.error).toBe("CTA URL must be a valid http(s) URL");
        expect(mockProjectStatusEmailService.send).not.toHaveBeenCalled();
    });

    it("returns 200 for valid payload", async () => {
        const request = createJsonRequest(
            "http://localhost/api/project-status-email",
            "POST",
            {
                clientName: "Client",
                clientEmail: "client@example.com",
                status: "abgeschlossen",
                ctaUrl: "https://example.com/project",
            },
        );

        const response = await POST(request);
        const payload = await parseJsonResponse<ProjectStatusPayload>(response);

        expect(response.status).toBe(200);
        expect(payload.success).toBe(true);
        expect(payload.data?.sent).toBe(true);
        expect(mockProjectStatusEmailService.send).toHaveBeenCalledTimes(1);
    });
});
