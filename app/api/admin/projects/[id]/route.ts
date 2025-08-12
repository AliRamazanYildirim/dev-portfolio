import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
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

    // Existierendes Projekt prüfen (Supabase)
    const { data: existingProjects, error: findError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .limit(1);

    const existingProject =
      existingProjects && existingProjects.length > 0
        ? existingProjects[0]
        : null;
    if (findError) {
      return NextResponse.json(
        { success: false, error: "Failed to check project" },
        { status: 500 }
      );
    }
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Slug-Eindeutigkeit prüfen bei Änderung (Supabase)
    if (slug !== existingProject.slug) {
      const { data: slugExists, error: slugError } = await supabaseAdmin
        .from("projects")
        .select("id")
        .eq("slug", slug)
        .limit(1);
      if (slugError) {
        return NextResponse.json(
          { success: false, error: "Failed to check slug uniqueness" },
          { status: 500 }
        );
      }
      if (slugExists && slugExists.length > 0) {
        return NextResponse.json(
          { success: false, error: "A project with this slug already exists" },
          { status: 400 }
        );
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

    // Lösche die alte Galerie (Supabase)
    await supabaseAdmin.from("project_images").delete().eq("projectId", id);

    // Neue Galerie hinzufügen (Supabase)
    if (galleryData.length > 0) {
      const { error: galleryError } = await supabaseAdmin
        .from("project_images")
        .insert(galleryData);
      if (galleryError) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to insert gallery",
            details: galleryError.message,
            hint: (galleryError as any).hint,
            code: (galleryError as any).code,
          },
          { status: 500 }
        );
      }
    }

    // Projekt aktualisieren (Supabase)
    const { data: updatedProjects, error: updateError } = await supabaseAdmin
      .from("projects")
      .update({
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
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (updateError || !updatedProjects || updatedProjects.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update project",
          details: updateError?.message || updateError,
        },
        { status: 500 }
      );
    }

    // Ziehe das Projekt erneut zusammen mit der Galerie.
    const { data: fullProject } = await supabase
      .from("projects")
      .select(`*, gallery:project_images(*), tags:project_tags(*)`)
      .eq("id", id)
      .single();

    return NextResponse.json(
      {
        success: true,
        data: fullProject,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Existierendes Projekt prüfen (Supabase)
    const { data: existingProjects, error: findError } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("id", id)
      .limit(1);
    const existingProject =
      existingProjects && existingProjects.length > 0
        ? existingProjects[0]
        : null;
    if (findError) {
      return NextResponse.json(
        { success: false, error: "Failed to check project" },
        { status: 500 }
      );
    }
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Galerie löschen (Supabase)
    await supabaseAdmin.from("project_images").delete().eq("projectId", id);

    // Projeyi sil (Supabase)
    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete project",
          details: deleteError?.message || deleteError,
        },
        { status: 500 }
      );
    }

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
