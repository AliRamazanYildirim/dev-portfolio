import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/app/api/admin/auth/service";
import { handleError } from "@/lib/api-response";
import { createAdminSessionSuccessResponse } from "@/lib/contracts/adminSession";
import { extractSessionToken } from "./validation";
import { AdminSessionService } from "./service";

// GET /api/admin/session - Session-Status prüfen - Check session status
export async function GET(request: NextRequest) {
  try {
    const token = extractSessionToken(request, AuthService.cookieName);

    const { user } = await AdminSessionService.verify(token);

    return NextResponse.json(createAdminSessionSuccessResponse(user));
  } catch (error) {
    return handleError(error, "Session check failed");
  }
}
