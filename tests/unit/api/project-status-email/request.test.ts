import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_APP_BASE_URL = process.env.APP_BASE_URL;
const ORIGINAL_NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const ORIGINAL_NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

function restoreEnv(): void {
    if (ORIGINAL_APP_BASE_URL === undefined) {
        delete process.env.APP_BASE_URL;
    } else {
        process.env.APP_BASE_URL = ORIGINAL_APP_BASE_URL;
    }

    if (ORIGINAL_NEXT_PUBLIC_SITE_URL === undefined) {
        delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
        process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_NEXT_PUBLIC_SITE_URL;
    }

    if (ORIGINAL_NEXT_PUBLIC_APP_URL === undefined) {
        delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
        process.env.NEXT_PUBLIC_APP_URL = ORIGINAL_NEXT_PUBLIC_APP_URL;
    }
}

async function importRequestModule() {
    vi.resetModules();
    return import("@/app/api/project-status-email/lib/request");
}

describe("project status request base URL", () => {
    afterEach(() => {
        restoreEnv();
        vi.resetModules();
    });

    it("uses APP_BASE_URL when provided", async () => {
        process.env.APP_BASE_URL = "https://example.com/some/path";
        delete process.env.NEXT_PUBLIC_SITE_URL;
        delete process.env.NEXT_PUBLIC_APP_URL;

        const { buildBaseUrl } = await importRequestModule();
        const baseUrl = buildBaseUrl(new Request("http://localhost/api/project-status-email"));

        expect(baseUrl).toBe("https://example.com");
    });

    it("falls back to default when configured url is invalid", async () => {
        process.env.APP_BASE_URL = "javascript:alert(1)";
        delete process.env.NEXT_PUBLIC_SITE_URL;
        delete process.env.NEXT_PUBLIC_APP_URL;

        const { buildBaseUrl } = await importRequestModule();
        const baseUrl = buildBaseUrl(new Request("http://localhost/api/project-status-email"));

        expect(baseUrl).toBe("https://www.arytechsolutions.com");
    });
});
