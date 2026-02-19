import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/app/api/admin/auth/service";
import { handleError } from "@/lib/api-response";

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const { token, user } = await AuthService.login(email, password);

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
