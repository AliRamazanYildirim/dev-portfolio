import { NextRequest } from "next/server";
import { successResponse, handleError } from "@/lib/api-response";
import { InvoiceEmailService } from "./service";

export async function POST(request: NextRequest) {
  try {
    const { invoiceData, customerEmail, customerName } = await request.json();
    const data = await InvoiceEmailService.send({ invoiceData, customerEmail, customerName });
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
