import { isIP } from "node:net";

const TRUSTED_IP_HEADERS = [
  "cf-connecting-ip",        // Cloudflare
  "x-vercel-forwarded-for",  // Vercel edge
  "fly-client-ip",           // Fly.io
  "true-client-ip",          // Some managed CDNs/proxies
  "x-real-ip",               // Nginx/ingress (when controlled)
] as const;

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

export function getIpFromHeaders(h: Headers): string {
  for (const header of TRUSTED_IP_HEADERS) {
    const ip = normalizeIp(h.get(header));
    if (ip) {
      return ip;
    }
  }

  // Safe fallback for local/dev or unknown infrastructure.
  return "127.0.0.1";
}
