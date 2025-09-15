import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs"; // Sicherstellen, dass Node-APIs (crypto) verfügbar sind
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

// Navigation aktualisieren (Supabase) - Aktualisiert die vorherigen und nächsten Slugs für Projekte
async function updateProjectNavigation() {
  // Alle Projekte auflisten (Prisma)
  const projects = await db.project.findMany({ where: { published: true }, select: { id: true, slug: true, createdAt: true }, orderBy: { createdAt: 'asc' } });
  if (!projects || projects.length === 0) return;

  for (let i = 0; i < projects.length; i++) {
    const current = projects[i];
    const previous = i > 0 ? projects[i - 1] : null;
    const next = i < projects.length - 1 ? projects[i + 1] : null;

    await db.project.update({ where: { id: current.id }, data: { previousSlug: previous?.slug || null, nextSlug: next?.slug || null } });
  }
}

// GET /api/projects - Alle Projekte abrufen
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    // Projekte abrufen (Prisma) mit Gallery und Tags
    const where: any = { published: true };
    if (featured === "true") where.featured = true;

    const take = limit ? parseInt(limit) : undefined;

    const data = await db.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { gallery: true, tags: true },
      take,
    });

    return NextResponse.json({ success: true, data: data || [], count: data ? data.length : 0 });
  } catch (error) {
    console.error("GET /api/projects error:", error);
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
    // Slug Check mit Admin-Client (robust gegen RLS)
    const existing = await db.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "A project with this slug already exists" }, { status: 400 });
    }

    // Projekt erstellen (Supabase)
    const projectId = randomUUID();
    const project = await db.project.create({
      data: {
        id: projectId,
        slug,
        title,
        description,
        role,
        duration,
        category,
        technologies,
        mainImage,
        featured,
        published: true,
        updatedAt: new Date(),
        previousSlug,
        nextSlug,
      },
    });

    // Galerie hinzufügen (Supabase)
    const galleryData = gallery.map((url: string, index: number) => ({
      id: randomUUID(),
      projectId: project.id,
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index,
    }));
    if (galleryData.length > 0) {
      await db.projectImage.createMany({ data: galleryData });
    }

    // Navigation automatisch aktualisieren
    await updateProjectNavigation();

    const fullProject = await db.project.findUnique({ where: { id: project.id }, include: { gallery: true, tags: true } });
    return NextResponse.json({ success: true, data: fullProject, message: "Project created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
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
