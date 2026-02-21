import { NextRequest } from "next/server";
import { AuthService } from "@/app/api/admin/auth/service";
import { successResponse, handleError } from "@/lib/api-response";
import { extractSessionToken } from "./validation";
import { AdminSessionService } from "./service";

// GET /api/admin/session - Session-Status prüfen - Check session status
export async function GET(request: NextRequest) {
  try {
    const token = extractSessionToken(request, AuthService.cookieName);

    const { user } = await AdminSessionService.verify(token);

    return successResponse({ authenticated: true, user });
  } catch (error) {
    return handleError(error, "Session check failed");
  }
}
