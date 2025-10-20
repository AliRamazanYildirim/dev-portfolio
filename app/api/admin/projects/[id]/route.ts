import { NextRequest, NextResponse } from "next/server";
import ProjectModel from "@/models/Project";
import ProjectImageModel from "@/models/ProjectImage";
import mongoose from "@/lib/mongodb";

// PUT /api/projects/admin/[id] - Projekt aktualisieren (Admin) - Update project (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // MongoDB-Verbindung sicherstellen
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

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

    // Validierung der erforderlichen Felder
    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Projekt suchen - mit String-ID (CUID2)
    const existingProject = await ProjectModel.findById(id).lean().exec();
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: `Project not found with ID: ${id}` },
        { status: 404 }
      );
    }

    // Slug-Eindeutigkeit prüfen bei Änderung
    if (slug !== existingProject.slug) {
      const slugExists = await ProjectModel.findOne({ slug, _id: { $ne: id } }).lean().exec();
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "A project with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Projekt-Update-Daten vorbereiten
    const updateData = {
      slug,
      title,
      description,
      role,
      duration,
      category,
      technologies,
      mainImage,
      featured,
      previousSlug: previousSlug || null,
      nextSlug: nextSlug || null,
      updatedAt: new Date(),
    };

    // Galerie-Update in einer Transaktion (für bessere Fehlerbehandlung)
    let galleryUpdateError = null;
    try {
      // Alte Galerie löschen
      const deleteResult = await ProjectImageModel.deleteMany({ projectId: id }).exec();
      console.log(`Deleted ${deleteResult.deletedCount} old gallery images for project ${id}`);

      // Neue Galerie hinzufügen
      if (gallery && gallery.length > 0) {
        const galleryData = gallery.map((url: string, index: number) => ({
          projectId: id,
          url,
          publicId: `portfolio_${slug}_${index}_${Date.now()}`,
          alt: `${title} screenshot ${index + 1}`,
          order: index,
        }));

        const insertResult = await ProjectImageModel.insertMany(galleryData);
        console.log(`Inserted ${insertResult.length} new gallery images for project ${id}`);
      }
    } catch (galleryError: any) {
      console.error("Gallery update error:", galleryError);
      galleryUpdateError = galleryError.message;
    }

    // Projekt aktualisieren
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: "Failed to update project" },
        { status: 500 }
      );
    }

    // Aktualisierte Galerie abrufen
    const galleryRes = await ProjectImageModel.find({ projectId: id })
      .sort({ order: 1 })
      .lean()
      .exec();

    return NextResponse.json(
      {
        success: true,
        data: {
          ...updatedProject.toObject(),
          gallery: galleryRes,
        },
        message: "Project updated successfully",
        ...(galleryUpdateError && { galleryWarning: galleryUpdateError }),
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

    // MongoDB-Verbindung sicherstellen
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Projekt existiert prüfen
    const existing = await ProjectModel.findById(id).lean().exec();
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Project not found with ID: ${id}` },
        { status: 404 }
      );
    }

    // Zuerst alle Galerie-Bilder löschen
    const deleteImagesResult = await ProjectImageModel.deleteMany({ projectId: id }).exec();
    console.log(`Deleted ${deleteImagesResult.deletedCount} gallery images for project ${id}`);

    // Dann das Projekt löschen
    const deleteProjectResult = await ProjectModel.findByIdAndDelete(id).exec();
    if (!deleteProjectResult) {
      return NextResponse.json(
        { success: false, error: "Failed to delete project" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
        deletedImages: deleteImagesResult.deletedCount,
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
