import { NextRequest } from "next/server";
import { ProjectBySlugService } from "./service";
import { validateProjectSlug } from "./validation";
import { successResponse, handleError } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

// GET /api/projects/[slug] - Retrieve single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = validateProjectSlug((await params).slug);

    const project = await ProjectBySlugService.getBySlug(slug);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return successResponse(project);
  } catch (error) {
    return handleError(error, "Failed to fetch project");
  }
}
