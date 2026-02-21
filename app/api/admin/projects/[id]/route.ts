import { NextRequest } from "next/server";
import { AdminProjectsService } from "@/app/api/admin/projects/service";
import { validateUpdateProjectBody } from "@/app/api/admin/projects/validation";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

// PUT /api/projects/admin/[id] - Projekt aktualisieren (Admin) - Update project (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Input validieren
    const validation = validateUpdateProjectBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const result = await AdminProjectsService.update(id, validation.value);
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
    const { id } = await params;
    const result = await AdminProjectsService.delete(id);
    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
