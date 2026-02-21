import { NextRequest } from "next/server";
import { AdminProjectByIdService } from "./service";
import { validateProjectId, validateUpdateBody } from "./validation";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

// PUT /api/projects/admin/[id] - Projekt aktualisieren (Admin) - Update project (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = validateProjectId((await params).id);
    const body = await request.json();

    // Input validieren
    const validation = validateUpdateBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const result = await AdminProjectByIdService.update(id, validation.value);
    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/projects/admin/[id] - Projekt löschen (Admin) - Delete project (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = validateProjectId((await params).id);
    const result = await AdminProjectByIdService.delete(id);
    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
