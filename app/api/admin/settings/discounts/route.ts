import { DiscountSettingsService } from "./service";
import { validateDiscountSettingsBody } from "./validation";
import { successResponse, handleError } from "@/lib/api-response";

export async function GET() {
    try {
        const result = await DiscountSettingsService.getSettings();
        return successResponse(result);
    } catch (error) {
        return handleError(error);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { enabled } = validateDiscountSettingsBody(body);
        const result = await DiscountSettingsService.updateSettings(enabled);
        return successResponse(result);
    } catch (error) {
        return handleError(error);
    }
}
