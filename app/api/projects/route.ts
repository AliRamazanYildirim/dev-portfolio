import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs"; // Sicherstellen, dass Node-APIs (crypto) verfügbar sind
import { db } from "@/lib/db";
import ProjectModel from "@/models/Project";
import ProjectImageModel from "@/models/ProjectImage";
import ProjectTagModel from "@/models/ProjectTag";
import { randomUUID } from "crypto";

// Navigation aktualisieren (Supabase) - Aktualisiert die vorherigen und nächsten Slugs für Projekte
async function updateProjectNavigation() {
  const projects = await ProjectModel.find({ published: true }).sort({ createdAt: 1 }).lean().exec();
  if (!projects || projects.length === 0) return;

  for (let i = 0; i < projects.length; i++) {
    const current = projects[i];
    const previous = i > 0 ? projects[i - 1] : null;
    const next = i < projects.length - 1 ? projects[i + 1] : null;

    await ProjectModel.findByIdAndUpdate(current._id, { previousSlug: previous?.slug || null, nextSlug: next?.slug || null }).exec();
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

    const projects = await ProjectModel.find(where).sort({ createdAt: -1 }).lean().exec();

    // load gallery and tags for each project
    const result = await Promise.all(
      projects.map(async (p) => {
        const gallery = await ProjectImageModel.find({ projectId: p._id }).sort({ order: 1 }).lean().exec();
        const tags = await ProjectTagModel.find({ projects: p._id }).lean().exec().catch(() => []);
        return { ...p, gallery, tags };
      })
    );

    return NextResponse.json({ success: true, data: result || [], count: result.length });
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
    const existing = await ProjectModel.findOne({ slug }).exec();
    if (existing) {
      return NextResponse.json({ success: false, error: "A project with this slug already exists" }, { status: 400 });
    }

    // Projekt erstellen (Supabase)
    const project = await ProjectModel.create({
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
    });

    // Galerie hinzufügen (Supabase)
    const galleryData = gallery.map((url: string, index: number) => ({
      projectId: project._id,
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index,
    }));
    if (galleryData.length > 0) {
      await ProjectImageModel.insertMany(galleryData);
    }

    // Navigation automatisch aktualisieren
    await updateProjectNavigation();

    const galleryRes = await ProjectImageModel.find({ projectId: project._id }).lean().exec();
    const tagsRes = await ProjectTagModel.find({ projects: project._id }).lean().exec().catch(() => []);
    return NextResponse.json({ success: true, data: { ...project.toObject(), gallery: galleryRes, tags: tagsRes }, message: "Project created successfully" }, { status: 201 });
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
