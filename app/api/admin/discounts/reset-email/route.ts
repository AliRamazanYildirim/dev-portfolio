import { validateBody } from "./validation";
import { ResetDiscountEmailService } from "./service";
import { successResponse, handleError } from "@/lib/api-response";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const input = validateBody(body);
        const data = await ResetDiscountEmailService.execute(input);
        return successResponse(data);
    } catch (error) {
        return handleError(error);
    }
}
