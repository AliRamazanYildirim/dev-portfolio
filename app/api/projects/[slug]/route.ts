import { NextRequest } from "next/server";
import { ProjectsService } from "@/app/api/projects/lib/service";
import { successResponse, handleError } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

// GET /api/projects/[slug] - Retrieve single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const project = await ProjectsService.getBySlug(slug);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return successResponse(project);
  } catch (error) {
    return handleError(error, "Failed to fetch project");
  }
}
