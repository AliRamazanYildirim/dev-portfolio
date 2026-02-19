import { NextRequest } from "next/server";
import { ProjectsService } from "./lib/service";
import { validateCreateProjectBody } from "./lib/validation";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

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

/**
 * POST /api/projects — Neues Projekt erstellen
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Input validieren
    const validation = validateCreateProjectBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    // 2. Service aufrufen
    const result = await ProjectsService.create(validation.value);

    if (!result.success) {
      throw new ValidationError(result.error || "Failed to create project");
    }

    return successResponse(
      { data: result.data, message: "Project created successfully" },
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}
