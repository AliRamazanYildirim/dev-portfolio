import { SendEmailService } from "./service";
import { jsonResponse } from "./utils";
import { validateSendEmailPayload } from "./validation";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const validation = validateSendEmailPayload(body);

    if (!validation.valid) {
      return jsonResponse({ success: false, error: validation.error }, 400);
    }

    const info = await SendEmailService.sendContactEmail(validation.value);
    return jsonResponse({ success: true, info }, 200);
  } catch (error) {
    console.error("Error sending email via SMTP:", error);
    const details = error instanceof Error ? error.message : String(error);
    return jsonResponse(
      { success: false, error: "Failed to send email", details },
      500
    );
  }
}
