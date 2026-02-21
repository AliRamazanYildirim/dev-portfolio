import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { handleError } from "@/lib/api-response";

// POST /api/admin/logout - Admin-Abmeldung - Admin logout
export async function POST(request: NextRequest) {
  try {
    // Erfolgreiche Antwort vorbereiten - Prepare successful response
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out",
    });

    // Cookie löschen durch Überschreiben mit abgelaufenem Datum
    // Delete cookie by overwriting with expired date
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Sofort ablaufen lassen - Expire immediately
    });

    return response;
  } catch (error) {
    return handleError(error, "Logout failed");
  }
}

// GET /api/admin/logout - Alternative für GET-Anfragen - Alternative for GET requests
export async function GET(request: NextRequest) {
  return POST(request);
}
