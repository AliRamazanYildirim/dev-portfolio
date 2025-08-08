import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";

// GET /api/admin/session - Session-Status prüfen - Check session status
export async function GET(request: NextRequest) {
  try {
    // Cookie aus der Anfrage lesen - Read cookie from request
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: "Keine Session gefunden - No session found",
        },
        { status: 401 }
      );
    }

    // Token verifizieren - Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: "Ungültige Session - Invalid session",
        },
        { status: 401 }
      );
    }

    // Benutzer in der Datenbank verifizieren - Verify user in database
    const adminUser = await db.adminUser.findUnique({
      where: {
        id: decoded.userId,
        active: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: "Benutzer nicht gefunden - User not found",
        },
        { status: 401 }
      );
    }

    // Erfolgreiche Session-Prüfung - Successful session check
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: "Session-Prüfung fehlgeschlagen - Session check failed",
      },
      { status: 500 }
    );
  }
}
