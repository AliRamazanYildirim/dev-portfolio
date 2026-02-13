import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ─── Constants ──────────────────────────────────────────────────────────────────
// Must match AUTH_COOKIE_NAME in lib/auth.ts
const AUTH_COOKIE_NAME = "admin-auth-token";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
const JWT_ISSUER = "portfolio-admin";

// ─── Public exceptions (no auth required) ───────────────────────────────────────
const PUBLIC_ROUTES = new Set([
    "/api/admin/login",
    "/api/admin/logout",
    "/admin/login",
]);

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

// ─── Middleware ──────────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes without auth
    if (PUBLIC_ROUTES.has(pathname)) {
        return NextResponse.next();
    }

    // Verify authentication
    const isAuthenticated = await verifyAuth(request);

    if (!isAuthenticated) {
        // API routes → 401 JSON response
        if (pathname.startsWith("/api/")) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Page routes → redirect to login
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// ─── Route matcher ──────────────────────────────────────────────────────────────
// Only run middleware on admin pages and protected API routes.
// Public APIs (/api/contact, /api/projects, /api/send-email, /api/referral/validate)
// are intentionally excluded.
export const config = {
    matcher: [
        // Admin panel pages
        "/admin/:path*",

        // Admin API routes (login/logout excluded above)
        "/api/admin/:path*",

        // Protected operational API routes
        "/api/invoice/:path*",
        "/api/upload/:path*",
        "/api/project-status-email/:path*",
        "/api/discounts/:path*",
        "/api/referral/send-email/:path*",
    ],
};
