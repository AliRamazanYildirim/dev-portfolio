import { NextRequest, NextResponse } from "next/server";
import { ProjectsService } from "./lib/service";
import { validateCreateProjectBody } from "./lib/validation";

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

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data.length,
    });
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 },
    );
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
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 2. Service aufrufen
    const result = await ProjectsService.create(validation.value);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, data: result.data, message: "Project created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST /api/projects]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
        details: error?.message || error,
      },
      { status: 500 },
    );
  }
}
