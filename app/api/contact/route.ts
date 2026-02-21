import { NextRequest } from "next/server";
import { ContactService } from "./service";
import { validateCreateContactRequest } from "./validation";
import {
  successResponse,
  errorResponse,
  handleError,
} from "@/lib/api-response";
import { attachRateLimitHeaders, rateLimitedResponse } from "./utils";

export const runtime = "nodejs"; // Node runtime notwendig für crypto

/**
 * POST /api/contact — Nachricht speichern
 * Handler nur für HTTP Request/Response - Business Logic in Service Layer
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limit Prüfung
    const rateLimitResult = await ContactService.checkRateLimit(request, "POST");
    if (!rateLimitResult.allowed) {
      return attachRateLimitHeaders(
        rateLimitedResponse(rateLimitResult.meta),
        rateLimitResult.meta
      );
    }

    // 2. Request Body parsen
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON in request body", 400);
    }

    // 3. Input validieren
    const validation = validateCreateContactRequest(body);
    if (!validation.valid) {
      const response = errorResponse(validation.error || "Validation failed", 400);
      return attachRateLimitHeaders(response, rateLimitResult.meta);
    }

    // 4. Business Logic in Service delegieren
    const result = await ContactService.createContact(body as any);
    if (!result.success) {
      const response = errorResponse(result.error, 500);
      return attachRateLimitHeaders(response, rateLimitResult.meta);
    }

    // 5. Erfolgreiche Response mit Rate Limit Headers
    const response = successResponse(
      result.data,
      "Message sent successfully",
      201
    );
    return attachRateLimitHeaders(response, rateLimitResult.meta);
  } catch (error) {
    return handleError(error, "Contact POST failed");
  }
}

/**
 * GET /api/contact — Nachrichten auflisten (Admin)
 * Handler nur für HTTP Request/Response - Business Logic in Service Layer
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Rate Limit Prüfung
    const rateLimitResult = await ContactService.checkRateLimit(request, "GET");
    if (!rateLimitResult.allowed) {
      return attachRateLimitHeaders(
        rateLimitedResponse(rateLimitResult.meta),
        rateLimitResult.meta
      );
    }

    // 2. Query Parameter parsen
    const params = request.nextUrl.searchParams;
    const unreadOnly = params.get("unread") === "true";
    const limit = Number(params.get("limit") ?? 0);

    // 3. Business Logic in Service delegieren
    const result = await ContactService.getContacts({
      unreadOnly,
      limit: limit > 0 ? limit : undefined,
    });

    if (!result.success) {
      const response = errorResponse(result.error, 500);
      return attachRateLimitHeaders(response, rateLimitResult.meta);
    }

    // 4. Erfolgreiche Response mit Rate Limit Headers und Count
    const response = successResponse(result.data);
    response.headers.set("X-Total-Count", String(result.count));
    return attachRateLimitHeaders(response, rateLimitResult.meta);
  } catch (error) {
    return handleError(error, "Contact GET failed");
  }
}
