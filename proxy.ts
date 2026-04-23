// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret, JWT_ISSUER } from "./lib/jwtConfig";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  verifyCsrfTokenPair,
} from "./lib/security/csrf";
import { buildSecurityHeaders } from "./lib/security/headers.mjs";

// ─── Constants ──────────────────────────────────────────────────────────────────
// Must match AUTH_COOKIE_NAME in lib/auth.ts
const AUTH_COOKIE_NAME = "admin-auth-token";

const JWT_SECRET = getJwtSecret();

// ─── Public exceptions (no auth required) ───────────────────────────────────────
const PUBLIC_ROUTES = new Set([
  "/api/admin/login",
  "/admin/login",
]);

// Admin-Bereich erfordert Auth; alle anderen Pfade sind public.
const ADMIN_PREFIXES = ["/admin", "/api/admin"];
const PROTECTED_API_PREFIXES = [
  "/api/invoice",
  "/api/upload",
  "/api/project-status-email",
  "/api/discounts",
  "/api/referral/send-email",
];

// Mutating HTTP-Methoden, die CSRF-Schutz benötigen
const CSRF_PROTECTED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// ─── Helpers ────────────────────────────────────────────────────────────────────
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function requiresAuth(pathname: string): boolean {
  return ADMIN_PREFIXES.some((p) => pathname.startsWith(p)) ||
    PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
}

function applySecurityHeaders(
  response: NextResponse,
  nonce: string | undefined,
): void {
  const headers = buildSecurityHeaders(process.env, { nonce });
  for (const { key, value } of headers) {
    response.headers.set(key, value);
  }
}

// ─── Auth verification (Edge-compatible via jose) ───────────────────────────────
async function verifyAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret, { issuer: JWT_ISSUER });
    return true;
  } catch {
    return false;
  }
}

/**
 * Prüft CSRF-Token für mutating Requests auf geschützten API-Routen.
 * Login/Logout sind ausgenommen (eigener Rate-Limit- und Turnstile-Schutz).
 */
function verifyCsrf(request: NextRequest): boolean {
  if (!CSRF_PROTECTED_METHODS.has(request.method)) return true;
  if (!request.nextUrl.pathname.startsWith("/api/")) return true;

  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value ?? null;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  return verifyCsrfTokenPair(cookieToken, headerToken);
}

// ─── Proxy (previously middleware) ──────────────────────────────────────────────
// ✅ Next.js expects either `export function proxy()` or `export default function proxy()`
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nonce für HTML-Seiten (nicht für API): aktiviert strict-dynamic CSP.
  const isApi = pathname.startsWith("/api/");
  const nonce = isApi ? undefined : generateNonce();

  // ─── Auth + CSRF für geschützte Routen ────────────────────────────────────────
  if (requiresAuth(pathname) && !PUBLIC_ROUTES.has(pathname)) {
    const isAuthenticated = await verifyAuth(request);

    if (!isAuthenticated) {
      if (isApi) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 },
        );
      }

      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const redirect = NextResponse.redirect(loginUrl);
      redirect.headers.set("Content-Type", "text/html; charset=utf-8");
      applySecurityHeaders(redirect, nonce);
      return redirect;
    }

    if (!verifyCsrf(request)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing CSRF token" },
        { status: 403 },
      );
    }
  }

  // ─── HTML-Response mit Nonce-Propagation ──────────────────────────────────────
  const requestHeaders = new Headers(request.headers);
  if (nonce) {
    requestHeaders.set("x-nonce", nonce);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  applySecurityHeaders(response, nonce);
  return response;
}

// ─── Route matcher ──────────────────────────────────────────────────────────────
// Alle HTML- und API-Pfade, ausser statische Assets und Next-Interna.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2)$).*)",
  ],
};
