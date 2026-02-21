import { DiscountEmailService } from "@/app/api/admin/discounts/service";
import { validateSendDiscountEmailBody } from "@/app/api/admin/discounts/validation";
import { successResponse, handleError } from "@/lib/api-response";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactionId, discountRate } = validateSendDiscountEmailBody(body);
        const data = await DiscountEmailService.sendEmail(transactionId, discountRate);
        return successResponse(data);
    } catch (error) {
        return handleError(error);
    }
}
