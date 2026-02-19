import { getDiscountsEnabled, setDiscountsEnabled } from "@/lib/discountSettings";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

export async function GET() {
    try {
        const enabled = await getDiscountsEnabled();
        return successResponse({ enabled });
    } catch (error) {
        return handleError(error);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { enabled } = body as { enabled?: unknown };

        if (typeof enabled !== "boolean") {
            throw new ValidationError("'enabled' must be a boolean");
        }

        const saved = await setDiscountsEnabled(enabled);
        return successResponse({ enabled: saved });
    } catch (error) {
        return handleError(error);
    }
}
