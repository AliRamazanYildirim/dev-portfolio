import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";
import { ReferralEmailService } from "./service";
import { validateSendReferralEmailBody } from "./validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Input validieren
    const validation = validateSendReferralEmailBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const data = await ReferralEmailService.send(validation.value);
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
