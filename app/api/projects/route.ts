import { NextRequest } from "next/server";
import { ProjectsService } from "./service";
import { successResponse, handleError } from "@/lib/api-response";

export const runtime = "nodejs";

/**
 * GET /api/projects — Alle veröffentlichten Projekte abrufen
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const data = await ProjectsService.list({
      featured: searchParams.get("featured") === "true" || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
    });

    return successResponse(data || []);
  } catch (error) {
    return handleError(error);
  }
}
