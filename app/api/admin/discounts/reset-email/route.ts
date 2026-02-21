import { DiscountEmailService } from "@/app/api/admin/discounts/service";
import { validateResetDiscountEmailBody } from "@/app/api/admin/discounts/validation";
import { successResponse, handleError } from "@/lib/api-response";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactionId, sendCorrectionEmail } = validateResetDiscountEmailBody(body);
        const data = await DiscountEmailService.resetEmail(transactionId, sendCorrectionEmail);
        return successResponse(data);
    } catch (error) {
        return handleError(error);
    }
}
