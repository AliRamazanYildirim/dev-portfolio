import { NextResponse } from "next/server";
import {
    CSRF_COOKIE_NAME,
    generateCsrfToken,
    getCsrfCookieOptions,
} from "@/lib/security/csrf";

export const runtime = "nodejs";

/**
 * GET /api/csrf — Liefert einen neuen CSRF-Token und setzt ihn als Cookie.
 * Client sendet diesen Token anschließend im `x-csrf-token` Header mit.
 */
export async function GET() {
    const token = generateCsrfToken();
    const response = NextResponse.json({ success: true, data: { token } });
    response.cookies.set(CSRF_COOKIE_NAME, token, getCsrfCookieOptions());
    return response;
}
