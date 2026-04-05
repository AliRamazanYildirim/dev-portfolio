import { NextRequest } from "next/server";
import { SendEmailService } from "./service";
import { errorResponse, successResponse, handleError } from "@/lib/api-response";
import { validateSendEmailPayload } from "./validation";
import { ValidationError } from "@/lib/errors";
import {
  checkSendEmailRateLimit,
  createSendEmailRequestContext,
  type SendEmailRateLimitDecision,
} from "./lib/rateLimit";
import { verifySendEmailTurnstile } from "./lib/turnstileVerifier";
import { attachRateLimitHeaders, rateLimitedResponse } from "./lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<Response> {
  let decision: SendEmailRateLimitDecision | null = null;

  try {
    const requestContext = createSendEmailRequestContext(req.headers);
    decision = await checkSendEmailRateLimit(requestContext);
    if (!decision.allowed) {
      return rateLimitedResponse(decision.meta, decision.policy);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      const response = errorResponse("Invalid JSON in request body", 400);
      return attachRateLimitHeaders(response, decision.meta, decision.policy);
    }

    const validation = validateSendEmailPayload(body);

    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const { turnstileToken, ...payload } = validation.value;
    await verifySendEmailTurnstile(requestContext, turnstileToken);

    const info = await SendEmailService.sendContactEmail(payload);
    const response = successResponse({ info });
    return attachRateLimitHeaders(response, decision.meta, decision.policy);
  } catch (error) {
    const response = handleError(error, "Failed to send email");
    if (!decision) {
      return response;
    }
    return attachRateLimitHeaders(response, decision.meta, decision.policy);
  }
}
