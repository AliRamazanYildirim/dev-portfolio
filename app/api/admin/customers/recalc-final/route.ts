import { RecalcFinalPriceService } from "./service";
import { validateBody } from "./validation";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = validateBody(body);
        if (!validation.valid) {
            throw new ValidationError(validation.error);
        }

        const data = await RecalcFinalPriceService.execute(validation.value.customerId);
        return successResponse(data);
    } catch (error) {
        return handleError(error);
    }
}
