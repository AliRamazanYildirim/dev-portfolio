import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";
import { validateProjectStatusPayload } from "./validation";
import { ProjectStatusEmailService } from "./service";

// Auth is enforced by middleware.ts — no manual token check needed here.

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Input validieren
    const validation = validateProjectStatusPayload(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const result = await ProjectStatusEmailService.send({
      payload: validation.value,
      request: req,
    });

    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
