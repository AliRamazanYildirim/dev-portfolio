import { NextResponse } from "next/server";
import { buildMailPayload, createProjectStatusTransporter } from "./lib/mailer";
import { ensureAuthenticated, buildBaseUrl } from "./lib/request";
import { buildLogoAttachment } from "./lib/logo";
import type { ProjectStatusPayload } from "./lib/types";

export async function POST(req: Request) {
  try {
    const body: ProjectStatusPayload = await req.json();

    if (!body?.clientEmail || !body?.clientName) {
      return NextResponse.json(
        { success: false, error: "Missing client information" },
        { status: 400 }
      );
    }

    const decoded = ensureAuthenticated(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("project-status-email error", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
