import { NextRequest } from "next/server";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";
import { AdminProjectsService } from "./service";
import { validateCreateProjectBody } from "./validation";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validation = validateCreateProjectBody(body);
        if (!validation.valid) {
            throw new ValidationError(validation.error);
        }

        const result = await AdminProjectsService.create(validation.value);
        return successResponse(result.data, 201);
    } catch (error) {
        return handleError(error);
    }
}
