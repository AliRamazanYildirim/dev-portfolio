import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
          error: "No session found",
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
          error: "Invalid session",
        },
        { status: 401 }
      );
    }

    // Supabase ile admin user sorgula
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email, name, active")
      .eq("id", decoded.userId)
      .eq("active", true)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, authenticated: false, error: "User not found" }, { status: 401 });
    }

    const adminUser = data;

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
        error: "Session check failed",
      },
      { status: 500 }
    );
  }
}
