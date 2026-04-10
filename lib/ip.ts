import { isIP } from "node:net";

const DEFAULT_TRUSTED_IP_HEADERS = [
  "x-vercel-forwarded-for",
  "cf-connecting-ip",
] as const;

const DEV_FALLBACK_IP_HEADERS = ["x-forwarded-for", "x-real-ip"] as const;

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const PRODUCTION_FALLBACK_IP = "0.0.0.0";
const DEVELOPMENT_FALLBACK_IP = "127.0.0.1";

function parseTrustedHeaders(): string[] {
  const raw = process.env.TRUSTED_IP_HEADERS;
  if (!raw) {
    return [...DEFAULT_TRUSTED_IP_HEADERS];
  }

  const configured = raw
    .split(",")
    .map((header) => header.trim().toLowerCase())
    .filter(Boolean);

  return configured.length > 0 ? configured : [...DEFAULT_TRUSTED_IP_HEADERS];
}

const TRUSTED_IP_HEADERS = parseTrustedHeaders();

function normalizeIp(raw: string | null): string | null {
  if (!raw) {
    return null;
  }

  const candidate = raw.split(",")[0]?.trim() || "";
  if (!candidate) {
    return null;
  }

  if (isIP(candidate)) {
    return candidate;
  }

  return null;
}

function readFirstValidIp(headers: Headers, headerNames: readonly string[]): string | null {
  for (const header of headerNames) {
    const ip = normalizeIp(headers.get(header));
    if (ip) {
      return ip;
    }
  }

  return null;
}

export function getIpFromHeaders(h: Headers): string {
  const trustedIp = readFirstValidIp(h, TRUSTED_IP_HEADERS);
  if (trustedIp) {
    return trustedIp;
  }

  if (!IS_PRODUCTION) {
    const devIp = readFirstValidIp(h, DEV_FALLBACK_IP_HEADERS);
    if (devIp) {
      return devIp;
    }

    return DEVELOPMENT_FALLBACK_IP;
  }

  return PRODUCTION_FALLBACK_IP;
}
