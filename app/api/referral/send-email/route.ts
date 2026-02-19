import { successResponse, handleError } from "@/lib/api-response";
import { ReferralEmailService } from "./service";

export async function POST(request: Request) {
  try {
    const { customerId, customerEmail } = await request.json();
    const data = await ReferralEmailService.send({ customerId, customerEmail });
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
