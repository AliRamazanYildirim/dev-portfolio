import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
const ORIGINAL_TRUSTED_IP_HEADERS = process.env.TRUSTED_IP_HEADERS;

function restoreEnv(): void {
  (process.env as Record<string, string | undefined>).NODE_ENV = ORIGINAL_NODE_ENV;

  if (ORIGINAL_TRUSTED_IP_HEADERS === undefined) {
    delete process.env.TRUSTED_IP_HEADERS;
  } else {
    process.env.TRUSTED_IP_HEADERS = ORIGINAL_TRUSTED_IP_HEADERS;
  }
}

async function importIpModule() {
  vi.resetModules();
  return import("@/lib/ip");
}

describe("ip extraction", () => {
  afterEach(() => {
    restoreEnv();
    vi.resetModules();
  });

  it("uses trusted forwarded header value", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.TRUSTED_IP_HEADERS;

    const { getIpFromHeaders } = await importIpModule();
    const headers = new Headers({
      "x-vercel-forwarded-for": "198.51.100.10, 198.51.100.99",
    });

    expect(getIpFromHeaders(headers)).toBe("198.51.100.10");
  });

  it("returns production fallback when trusted headers are missing", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.TRUSTED_IP_HEADERS;

    const { getIpFromHeaders } = await importIpModule();
    const headers = new Headers();

    expect(getIpFromHeaders(headers)).toBe("0.0.0.0");
  });

  it("uses custom trusted header list from environment", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.TRUSTED_IP_HEADERS = "x-real-ip";

    const { getIpFromHeaders } = await importIpModule();
    const headers = new Headers({
      "x-vercel-forwarded-for": "198.51.100.10",
      "x-real-ip": "203.0.113.42",
    });

    expect(getIpFromHeaders(headers)).toBe("203.0.113.42");
  });

  it("uses dev fallback headers in non-production", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
    delete process.env.TRUSTED_IP_HEADERS;

    const { getIpFromHeaders } = await importIpModule();
    const headers = new Headers({
      "x-forwarded-for": "127.0.0.2",
    });

    expect(getIpFromHeaders(headers)).toBe("127.0.0.2");
  });
});
