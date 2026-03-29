import { NextRequest } from "next/server";
import { AuthService } from "@/app/api/admin/auth/service";
import { extractSessionToken } from "@/app/api/admin/session/validation";
import { ContactService } from "@/app/api/contact/service";
import { attachRateLimitHeaders, rateLimitedResponse } from "@/app/api/contact/utils";
import { successResponse, errorResponse, handleError } from "@/lib/api-response";
import { UnauthorizedError } from "@/lib/errors";

export const runtime = "nodejs";

/**
 * GET /api/admin/contact — Nachrichten auflisten (Admin)
 * Handler nur für HTTP Request/Response - Business Logic in Service Layer
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Admin-Session prüfen (Defense-in-depth zusätzlich zum Proxy-Schutz)
    const token = extractSessionToken(request, AuthService.cookieName);
    await AuthService.verifySession(token);

    // 2. Rate Limit Prüfung
    const rateLimitResult = await ContactService.checkRateLimit(request, "GET");
    if (!rateLimitResult.allowed) {
      return attachRateLimitHeaders(
        rateLimitedResponse(rateLimitResult.meta),
        rateLimitResult.meta
      );
    }

    // 3. Query Parameter parsen
    const params = request.nextUrl.searchParams;
    const unreadOnly = params.get("unread") === "true";
    const limit = Number(params.get("limit") ?? 0);

    // 4. Business Logic in Service delegieren
    const result = await ContactService.getContacts({
      unreadOnly,
      limit: limit > 0 ? limit : undefined,
    });

    if (!result.success) {
      const response = errorResponse(result.error, 500);
      return attachRateLimitHeaders(response, rateLimitResult.meta);
    }

    // 5. Erfolgreiche Response mit Rate Limit Headers und Count
    const response = successResponse(result.data);
    response.headers.set("X-Total-Count", String(result.count));
    return attachRateLimitHeaders(response, rateLimitResult.meta);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return errorResponse("Unauthorized", 401);
    }
    return handleError(error, "Admin Contact GET failed");
  }
}
