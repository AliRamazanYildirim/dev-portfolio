import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";
import { buildMailPayload, createProjectStatusTransporter } from "./lib/mailer";
import { buildBaseUrl } from "./lib/request";
import { buildLogoAttachment } from "./lib/logo";
import type { ProjectStatusPayload } from "./lib/types";

// Auth is enforced by middleware.ts — no manual token check needed here.

export async function POST(req: Request) {
  try {
    const body: ProjectStatusPayload = await req.json();

    if (!body?.clientEmail || !body?.clientName) {
      throw new ValidationError("Missing client information");
    }

    const { transporter, from } = createProjectStatusTransporter();
    const baseUrl = buildBaseUrl(req);
    const { attachments, logoCid } = buildLogoAttachment();

    const mailOptions = buildMailPayload({
      payload: body,
      baseUrl,
      from,
      attachments,
      logoCid,
    });

    await transporter.sendMail(mailOptions);

    return successResponse({ sent: true });
  } catch (error) {
    return handleError(error);
  }
}
