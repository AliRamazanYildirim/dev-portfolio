import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

// PUT /api/projects/admin/[id] - Projekt aktualisieren (Admin) - Update project (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      slug,
      title,
      description,
      role,
      duration,
      category,
      technologies,
      mainImage,
      gallery = [],
      featured = false,
      previousSlug,
      nextSlug,
    } = body;

    const existingProject = await db.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Slug-Eindeutigkeit prüfen bei Änderung (Supabase)
    if (slug !== existingProject.slug) {
      const slugExists = await db.project.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json({ success: false, error: "A project with this slug already exists" }, { status: 400 });
      }
    }

    // Galerie vorbereiten (Supabase)
    const galleryData = gallery.map((url: string, index: number) => ({
      id: randomUUID(),
      projectId: id,
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index,
    }));

    // Lösche die alte Galerie (Prisma)
    await db.projectImage.deleteMany({ where: { projectId: id } });
    // Neue Galerie hinzufügen (Prisma)
    if (galleryData.length > 0) {
      await db.projectImage.createMany({ data: galleryData });
    }

    // Projekt aktualisieren (Supabase)
    const updatedProject = await db.project.update({ where: { id }, data: { slug, title, description, role, duration, category, technologies, mainImage, featured, previousSlug, nextSlug, updatedAt: new Date() } });

    // Ziehe das Projekt erneut zusammen mit der Galerie.
    const fullProject = await db.project.findUnique({ where: { id }, include: { gallery: true, tags: true } });
    return NextResponse.json({ success: true, data: fullProject, message: "Project updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
        details: error?.message || error,
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

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    await db.projectImage.deleteMany({ where: { projectId: id } });
    await db.project.delete({ where: { id } });

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project",
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}
