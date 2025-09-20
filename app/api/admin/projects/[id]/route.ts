import { NextRequest, NextResponse } from "next/server";
import ProjectModel from "@/models/Project";
import ProjectImageModel from "@/models/ProjectImage";

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

    const existingProject = await ProjectModel.findById(id).lean().exec();
    if (!existingProject) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Slug-Eindeutigkeit prüfen bei Änderung (Supabase)
    if (slug !== existingProject.slug) {
      const slugExists = await ProjectModel.findOne({ slug }).lean().exec();
      if (slugExists) {
        return NextResponse.json({ success: false, error: "A project with this slug already exists" }, { status: 400 });
      }
    }

    // Galerie vorbereiten (Supabase)
    const galleryData = gallery.map((url: string, index: number) => ({
      projectId: id,
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index,
    }));

    // Lösche die alte Galerie (Mongo)
    await ProjectImageModel.deleteMany({ projectId: id }).exec();
    // Neue Galerie hinzufügen (Mongo)
    if (galleryData.length > 0) {
      await ProjectImageModel.insertMany(galleryData);
    }

    // Projekt aktualisieren (Supabase)
    const updatedProject = await ProjectModel.findByIdAndUpdate(id, { slug, title, description, role, duration, category, technologies, mainImage, featured, previousSlug, nextSlug, updatedAt: new Date() }, { new: true }).exec();
    const galleryRes = await ProjectImageModel.find({ projectId: id }).sort({ order: 1 }).lean().exec();
    return NextResponse.json({ success: true, data: { ...updatedProject?.toObject(), gallery: galleryRes }, message: "Project updated successfully" }, { status: 200 });
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

    const existing = await ProjectModel.findById(id).lean().exec();
    if (!existing) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    await ProjectImageModel.deleteMany({ projectId: id }).exec();
    await ProjectModel.findByIdAndDelete(id).exec();

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
