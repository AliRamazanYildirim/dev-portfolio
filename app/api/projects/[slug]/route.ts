import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET /api/projects/[slug] - Retrieve single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Einzelnes Projekt mit Galerie/Tags laden (Admin-Client, um RLS-Probleme zu vermeiden)
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select(
        `id, slug, title, author, description, role, duration, category, technologies, mainImage, featured, createdAt, updatedAt, previousSlug, nextSlug,
         gallery:project_images(id, url, alt, order),
         tags:project_tags(id, name, color)`
      )
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // previous/next aus Feldern oder fallback-berechnet ermitteln
    let prev = project.previousSlug ?? null;
    let next = project.nextSlug ?? null;
    if (prev === null || next === null) {
      const { data: allProjects } = await supabase
        .from("projects")
        .select("slug, createdAt")
        .eq("published", true)
        .order("createdAt", { ascending: true });
      if (allProjects && allProjects.length > 0) {
        const index = allProjects.findIndex((p) => p.slug === slug);
        prev = index > 0 ? allProjects[index - 1].slug : null;
        next =
          index < allProjects.length - 1 ? allProjects[index + 1].slug : null;
      }
    }

    // Technologien parsen - Parse technologies field
    let technologies: string[] = [];
    try {
      if (typeof project.technologies === "string") {
        technologies = JSON.parse(project.technologies);
      } else if (Array.isArray(project.technologies)) {
        technologies = project.technologies;
      }
    } catch (parseError) {
      technologies =
        typeof project.technologies === "string"
          ? project.technologies.split(",").map((tech) => tech.trim())
          : [];
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        technologies,
        previousSlug: prev,
        nextSlug: next,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
