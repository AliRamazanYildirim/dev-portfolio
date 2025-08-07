import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/projects/[slug] - Retrieve single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const project = await db.project.findUnique({
      where: { slug, published: true },
      include: {
        gallery: { orderBy: { order: "asc" } },
        tags: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Tüm yayınlanmış projeleri ID'ye göre sıralı şekilde al - Get all published projects sorted by ID
    const allProjects = await db.project.findMany({
      where: { published: true },
      select: { id: true, slug: true },
      orderBy: { createdAt: "asc" }, // En eskiden en yeniye doğru sıralama
    });

    // Mevcut projenin index'ini bul - Find current project index
    const currentIndex = allProjects.findIndex((p) => p.slug === slug);

    // Önceki ve sonraki proje slug'larını hesapla - Calculate previous and next project slugs
    const previousSlug =
      currentIndex > 0 ? allProjects[currentIndex - 1].slug : null;
    const nextSlug =
      currentIndex < allProjects.length - 1
        ? allProjects[currentIndex + 1].slug
        : null;

    // Technologien parsen - Parse technologies field
    let technologies = [];
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
        technologies: technologies,
        previousSlug,
        nextSlug,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
