import { validateReferral } from "./service";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";
import { validateReferralInput } from "./validation";

// Route handler delegates to service for validation and discount calculation
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Input validieren
    const validation = validateReferralInput(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const result = await validateReferral(validation.value);

    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
