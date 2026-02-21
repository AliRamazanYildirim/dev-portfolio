import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/app/api/admin/auth/service";
import { handleError } from "@/lib/api-response";
import { validateLoginBody } from "./validation";
import { AdminLoginService } from "./service";

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = validateLoginBody(body);

    const { token, user } = await AdminLoginService.login(input);

    const response = NextResponse.json({
      success: true,
      message: "Successfully logged in",
      user,
    });

    response.cookies.set(AuthService.cookieName, token, AuthService.cookieOptions);

    return response;
  } catch (error) {
    return handleError(error, "Login failed");
  }
}
