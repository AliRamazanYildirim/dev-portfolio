import { CustomersService } from "@/app/api/admin/customers/service";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId } = body;
        if (!customerId) {
            throw new ValidationError("customerId is required");
        }

        const data = await CustomersService.recalcFinalPrice(String(customerId));
        return successResponse(data);
    } catch (error) {
        return handleError(error);
    }
}
