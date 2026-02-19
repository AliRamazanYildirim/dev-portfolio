import { NextRequest, NextResponse } from "next/server";
import { AdminProjectsService } from "@/app/api/admin/projects/service";

// PUT /api/projects/admin/[id] - Projekt aktualisieren (Admin) - Update project (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await AdminProjectsService.update(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: (result as any).status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: result.message,
        ...((result as any).galleryWarning && { galleryWarning: (result as any).galleryWarning }),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Project update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
        details: error?.message || String(error),
        stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
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

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: (result as any).status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        deletedImages: result.deletedImages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Project delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project",
        details: error?.message || String(error),
        stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
