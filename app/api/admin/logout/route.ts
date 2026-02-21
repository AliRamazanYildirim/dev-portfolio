import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-response";
import { validateLogoutRequest } from "./validation";
import { AdminLogoutService } from "./service";

// POST /api/admin/logout - Admin-Abmeldung - Admin logout
export async function POST(request: NextRequest) {
  try {
    validateLogoutRequest(request);

    // Erfolgreiche Antwort vorbereiten - Prepare successful response
    const response = NextResponse.json(AdminLogoutService.buildPayload());

    // Cookie löschen durch Überschreiben mit abgelaufenem Datum
    // Delete cookie by overwriting with expired date
    response.cookies.set(AdminLogoutService.getCookieName(), "", AdminLogoutService.getExpiredCookieOptions());

    return response;
  } catch (error) {
    return handleError(error, "Logout failed");
  }
}

// GET /api/admin/logout - Alternative für GET-Anfragen - Alternative for GET requests
export async function GET(request: NextRequest) {
  return POST(request);
}
