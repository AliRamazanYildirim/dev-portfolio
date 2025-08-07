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
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
