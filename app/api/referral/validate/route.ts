import { validateReferral } from "./service";
import { errorResponse, successResponse, handleError } from "@/lib/api-response";
import { validateReferralInput } from "./validation";
import {
  checkReferralValidateRateLimit,
  createReferralValidateRequestContext,
  type ReferralValidateRateLimitDecision,
} from "./rateLimit";
import { attachRateLimitHeaders, rateLimitedResponse } from "./utils";

// Route handler delegates to service for validation and discount calculation
export async function POST(request: Request) {
  let decision: ReferralValidateRateLimitDecision | null = null;

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON in request body", 400);
    }

    const referralCodeCandidate =
      body && typeof body === "object" && typeof (body as Record<string, unknown>).referralCode === "string"
        ? String((body as Record<string, unknown>).referralCode)
        : "invalid";

    const context = createReferralValidateRequestContext(
      request.headers,
      referralCodeCandidate,
    );
    decision = await checkReferralValidateRateLimit(context);
    if (!decision.allowed) {
      return rateLimitedResponse(decision.meta, decision.policy);
    }

    // Input validieren
    const validation = validateReferralInput(body);
    if (!validation.valid) {
      const response = errorResponse(validation.error, 400);
      return attachRateLimitHeaders(response, decision.meta, decision.policy);
    }

    const result = await validateReferral(validation.value);
    const response = successResponse(result);
    return attachRateLimitHeaders(response, decision.meta, decision.policy);
  } catch (error) {
    const response = handleError(error);
    if (!decision) {
      return response;
    }
    return attachRateLimitHeaders(response, decision.meta, decision.policy);
  }
}
