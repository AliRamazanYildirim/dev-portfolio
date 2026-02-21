import { NextRequest } from "next/server";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";
import { InvoiceEmailService } from "./service";
import { validateSendInvoiceBody } from "./validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Input validieren
    const validation = validateSendInvoiceBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const data = await InvoiceEmailService.send(validation.value);
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
