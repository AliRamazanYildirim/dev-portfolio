import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Navigation aktualisieren (Supabase) - Aktualisiert die vorherigen und nächsten Slugs für Projekte
async function updateProjectNavigation() {
  // Alle Projekte auflisten
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, slug, createdAt")
    .eq("published", true)
    .order("createdAt", { ascending: true });

  if (error || !projects) return;

  for (let i = 0; i < projects.length; i++) {
    const current = projects[i];
    const previous = i > 0 ? projects[i - 1] : null;
    const next = i < projects.length - 1 ? projects[i + 1] : null;

    await supabase
      .from("projects")
      .update({
        previousSlug: previous?.slug || null,
        nextSlug: next?.slug || null,
      })
      .eq("id", current.id);
  }
}

// GET /api/projects - Alle Projekte abrufen
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    // Projekte mit Supabase abrufen
    let query = supabase
      .from("projects")
      .select(`*, gallery:project_images(*), tags:project_tags(*)`)
      .eq("published", true)
      .order("createdAt", { ascending: false });

    if (featured === "true") {
      query = query.eq("featured", true);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch projects" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
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

    // Slug-Eindeutigkeit prüfen (Supabase)
    const { data: existingProjects, error: findError } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    if (findError) {
      return NextResponse.json(
        { success: false, error: "Failed to check slug uniqueness" },
        { status: 500 }
      );
    }
    if (existingProjects && existingProjects.length > 0) {
      return NextResponse.json(
        { success: false, error: "A project with this slug already exists" },
        { status: 400 }
      );
    }

    // Projekt erstellen (Supabase)
    const { data: project, error: createError } = await supabase
      .from("projects")
      .insert([
        {
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
        },
      ])
      .select()
      .single();

    if (createError || !project) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create project",
          details: createError?.message || createError,
        },
        { status: 500 }
      );
    }

    // Galerie hinzufügen (Supabase)
    const galleryData = gallery.map((url: string, index: number) => ({
      projectId: project.id,
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index,
    }));
    if (galleryData.length > 0) {
      await supabase.from("project_images").insert(galleryData);
    }

    // Navigation automatisch aktualisieren
    await updateProjectNavigation();

    // Projekt mit Galerie erneut abrufen
    const { data: fullProject } = await supabase
      .from("projects")
      .select(`*, gallery:project_images(*), tags:project_tags(*)`)
      .eq("id", project.id)
      .single();

    return NextResponse.json(
      {
        success: true,
        data: fullProject,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}
