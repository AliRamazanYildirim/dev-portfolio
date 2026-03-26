import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/app/api/admin/auth/service";
import { errorResponse, handleError } from "@/lib/api-response";
import { createAdminLoginSuccessResponse } from "@/lib/contracts/adminLogin";
import { validateLoginBody } from "./validation";
import { AdminLoginService } from "./service";
import { UnauthorizedError } from "@/lib/errors";
import { getIpFromHeaders } from "@/lib/ip";
import { attachRateLimitHeaders, rateLimitedResponse } from "./utils";

export const runtime = "nodejs";

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON in request body", 400);
    }

    const input = validateLoginBody(body);
    const context = {
      ip: getIpFromHeaders(request.headers),
      email: AdminLoginService.normalizeEmail(input.email),
    };

    const requestDecision = await AdminLoginService.checkRequestRateLimit(context);
    if (!requestDecision.allowed) {
      return rateLimitedResponse(requestDecision.meta, requestDecision.policy);
    }

    const failedLockDecision = await AdminLoginService.checkFailedLock(context);
    if (!failedLockDecision.allowed) {
      return rateLimitedResponse(
        failedLockDecision.meta,
        failedLockDecision.policy,
        "Too many failed login attempts. Please try again later.",
      );
    }

    const backoffDecision = await AdminLoginService.checkExponentialBackoff(context);
    if (!backoffDecision.allowed) {
      return rateLimitedResponse(
        backoffDecision.meta,
        backoffDecision.policy,
        "Please wait before trying again.",
      );
    }

    await AdminLoginService.verifyTurnstile(context, input.turnstileToken);

    try {
      const { token, user } = await AdminLoginService.login(input);
      await AdminLoginService.resetFailedAttempts(context);

      const response = NextResponse.json(createAdminLoginSuccessResponse(user));
      response.cookies.set(AuthService.cookieName, token, AuthService.cookieOptions);

      return attachRateLimitHeaders(
        response,
        requestDecision.meta,
        requestDecision.policy,
      );
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError) {
        const failedDecision = await AdminLoginService.registerFailedAttempt(context);
        if (!failedDecision.allowed) {
          return rateLimitedResponse(
            failedDecision.meta,
            failedDecision.policy,
            "Too many failed login attempts. Please try again later.",
          );
        }

        const newBackoffDecision = await AdminLoginService.applyExponentialBackoff(
          context,
          failedDecision,
        );

        const unauthorizedResponse = handleError(error, "Login failed");
        return attachRateLimitHeaders(
          unauthorizedResponse,
          newBackoffDecision.meta,
          newBackoffDecision.policy,
        );
      }

      throw error;
    }
  } catch (error) {
    return handleError(error, "Login failed");
  }
}
