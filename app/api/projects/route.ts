import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Navigation aktualisieren - Update project navigation
async function updateProjectNavigation() {
  const projects = await db.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, slug: true },
  });

  for (let i = 0; i < projects.length; i++) {
    const current = projects[i];
    const previous = i > 0 ? projects[i - 1] : null;
    const next = i < projects.length - 1 ? projects[i + 1] : null;

    await db.project.update({
      where: { id: current.id },
      data: {
        previousSlug: previous?.slug || null,
        nextSlug: next?.slug || null,
      },
    });
  }
}

// GET /api/projects - Retrieve all projects
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    const projects = await db.project.findMany({
      where: {
        published: true,
        ...(featured === "true" && { featured: true }),
      },
      include: {
        gallery: {
          orderBy: { order: "asc" },
        },
        tags: true,
      },
      orderBy: { createdAt: "desc" },
      ...(limit && { take: parseInt(limit) }),
    });

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
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

    // Slug-Eindeutigkeit prüfen - Check slug uniqueness
    const existingProject = await db.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { success: false, error: "A project with this slug already exists" },
        { status: 400 }
      );
    }

    // Galerie vorbereiten - Prepare gallery
    const galleryData = gallery.map((url: string, index: number) => ({
      url,
      publicId: `portfolio_${slug}_${index}`,
      alt: `${title} screenshot ${index + 1}`,
      order: index,
    }));

    const project = await db.project.create({
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

    // Navigation automatisch aktualisieren - Auto-update navigation
    await updateProjectNavigation();

    return NextResponse.json(
      {
        success: true,
        data: project,
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
