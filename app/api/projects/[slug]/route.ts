import { NextRequest, NextResponse } from "next/server";
import ProjectModel from "@/models/Project";
import ProjectImageModel from "@/models/ProjectImage";

// GET /api/projects/[slug] - Retrieve single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Einzelnes Projekt mit Galerie laden (MongoDB)
    const project = await ProjectModel.findOne({ slug }).lean().exec();
    if (!project || !project.published) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // previous/next aus Feldern oder fallback-berechnet ermitteln
    // Always recalculate to ensure correct values
    const allProjects = await ProjectModel.find({ published: true }).sort({ createdAt: 1 }).lean().exec();
    let prev: string | null = null;
    let next: string | null = null;

    if (allProjects && allProjects.length > 0) {
      const index = allProjects.findIndex((p) => p.slug === slug);
      if (index !== -1) {
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
    const gallery = await ProjectImageModel.find({ projectId: project._id }).sort({ order: 1 }).lean().exec();

    return NextResponse.json({ success: true, data: { ...project, gallery, technologies, previousSlug: prev, nextSlug: next } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
