import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/projects/[slug] - Retrieve single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Einzelnes Projekt mit Galerie/Tags laden (Prisma)
    const project = await db.project.findUnique({ where: { slug }, include: { gallery: true, tags: true } });
    if (!project || !project.published) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // previous/next aus Feldern oder fallback-berechnet ermitteln
    let prev = project.previousSlug ?? null;
    let next = project.nextSlug ?? null;
    if (prev === null || next === null) {
      const allProjects = await db.project.findMany({ where: { published: true }, select: { slug: true, createdAt: true }, orderBy: { createdAt: 'asc' } });
      if (allProjects && allProjects.length > 0) {
        const index = allProjects.findIndex((p) => p.slug === slug);
        prev = index > 0 ? allProjects[index - 1].slug : null;
        next = index < allProjects.length - 1 ? allProjects[index + 1].slug : null;
      }
    }

    // Technologien parsen - Parse technologies field
    let technologies: string[] = [];
    try {
      if (typeof project.technologies === "string") {
        technologies = JSON.parse(project.technologies);
      } else if (Array.isArray(project.technologies)) {
        technologies = project.technologies as string[];
      }
    } catch (parseError) {
      technologies =
        typeof project.technologies === "string"
          ? project.technologies.split(",").map((tech) => tech.trim())
          : [];
    }

    return NextResponse.json({ success: true, data: { ...project, technologies, previousSlug: prev, nextSlug: next } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
