import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/app/api/admin/auth/service";
import { handleError } from "@/lib/api-response";

// GET /api/admin/session - Session-Status prüfen - Check session status
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AuthService.cookieName)?.value;

    const { user } = await AuthService.verifySession(token);

    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
    });
  } catch (error) {
    return handleError(error, "Session check failed");
  }
}
