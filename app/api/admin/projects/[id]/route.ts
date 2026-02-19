import { NextRequest } from "next/server";
import { AdminProjectsService } from "@/app/api/admin/projects/service";
import { successResponse, handleError } from "@/lib/api-response";

// PUT /api/projects/admin/[id] - Projekt aktualisieren (Admin) - Update project (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await AdminProjectsService.update(id, body);
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
