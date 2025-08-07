import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/projects/admin/[id] - Projekt aktualisieren (Admin) - Update project (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Existierendes Projekt prüfen - Check existing project
    const existingProject = await db.project.findUnique({
      where: { id },
      include: { gallery: true },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Slug-Eindeutigkeit prüfen bei Änderung - Check slug uniqueness if changed
    if (slug !== existingProject.slug) {
      const slugExists = await db.project.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "A project with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Galerie vorbereiten - Prepare gallery
    const galleryData = gallery.map((url: string, index: number) => ({
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index,
    }));

    // Projekt aktualisieren - Update project
    const updatedProject = await db.project.update({
      where: { id },
      data: {
        slug,
        title,
        description,
        role,
        duration,
        category,
        technologies,
        mainImage,
        featured,
        previousSlug,
        nextSlug,
        gallery: {
          deleteMany: {}, // Existierende Galerie löschen - Delete existing gallery
          create: galleryData, // Neue Galerie erstellen - Create new gallery
        },
      },
      include: {
        gallery: {
          orderBy: { order: "asc" },
        },
        tags: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedProject,
        message: "Project updated successfully",
      },
      { status: 200 }
    );
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Existierendes Projekt prüfen - Check existing project
    const existingProject = await db.project.findUnique({
      where: { id },
      include: { gallery: true },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Projekt löschen (Cascade löscht Gallery und Tags) - Delete project (Cascade deletes gallery and tags)
    await db.project.delete({
      where: { id },
    });

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
