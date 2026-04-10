import { describe, expect, it } from "vitest";
import { validateProjectStatusPayload } from "@/app/api/project-status-email/validation";

describe("project status payload validation", () => {
    it("rejects invalid client email", () => {
        const result = validateProjectStatusPayload({
            clientName: "Client",
            clientEmail: "invalid-email",
            status: "gestart",
        });

        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toBe("Client email format is invalid");
        }
    });

    it("rejects non-http cta url", () => {
        const result = validateProjectStatusPayload({
            clientName: "Client",
            clientEmail: "client@example.com",
            status: "gestart",
            ctaUrl: "javascript:alert(1)",
        });

        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toBe("CTA URL must be a valid http(s) URL");
        }
    });

    it("accepts valid payload and normalizes cta url", () => {
        const result = validateProjectStatusPayload({
            clientName: "  Client  ",
            clientEmail: "client@example.com",
            status: "abgeschlossen",
            ctaUrl: "https://example.com/project",
        });

        expect(result.valid).toBe(true);
        if (result.valid) {
            expect(result.value.clientName).toBe("Client");
            expect(result.value.ctaUrl).toBe("https://example.com/project");
        }
    });
});
