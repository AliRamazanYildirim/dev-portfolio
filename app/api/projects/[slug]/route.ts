import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/projects/[slug] - Einzelnes Projekt abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const project = await db.project.findUnique({
      where: {
        slug: slug,
        published: true,
      },
      include: {
        gallery: {
          orderBy: { order: "asc" },
        },
        tags: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[slug] - Projekt aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const {
      title,
      description,
      role,
      duration,
      category,
      technologies,
      mainImage,
      gallery = [],
      featured,
      previousSlug,
      nextSlug,
      published = true,
    } = body;

    // Überprüfe, ob das Projekt existiert.
    const existingProject = await db.project.findUnique({
      where: { slug },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Löschen Sie zuerst die vorhandenen Galeriebilder.
    await db.projectImage.deleteMany({
      where: { projectId: existingProject.id },
    });

    // Bereite die neuen Galeriebilder vor
    const galleryData = gallery.map((url: string, index: number) => ({
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index,
    }));

    const updatedProject = await db.project.update({
      where: { slug },
      data: {
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
        published,
        gallery: {
          create: galleryData,
        },
      },
      include: {
        gallery: {
          orderBy: { order: "asc" },
        },
        tags: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// LÖSCHEN /api/projects/[slug] - Projekt löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const existingProject = await db.project.findUnique({
      where: { slug },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Projekt löschen (Mit Cascade werden auch Galeriebilder gelöscht)
    await db.project.delete({
      where: { slug },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
