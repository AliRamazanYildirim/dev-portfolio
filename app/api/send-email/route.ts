import { SendEmailService } from "./service";
import { successResponse, handleError } from "@/lib/api-response";
import { validateSendEmailPayload } from "./lib/validation";
import { ValidationError } from "@/lib/errors";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const validation = validateSendEmailPayload(body);

    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const info = await SendEmailService.sendContactEmail(validation.value);
    return successResponse({ info });
  } catch (error) {
    return handleError(error, "Failed to send email");
  }
}
