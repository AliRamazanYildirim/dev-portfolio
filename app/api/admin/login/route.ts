import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  verifyPassword,
  createToken,
  AUTH_COOKIE_NAME,
  COOKIE_OPTIONS,
} from "@/lib/auth";

// POST /api/admin/login - Admin-Anmeldung - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Eingabevalidierung - Input validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // E-Mail-Format prüfen - Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    // Supabase ile admin user sorgula
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email, name, password, active")
      .eq("email", email.toLowerCase().trim())
      .eq("active", true)
      .single();

    if (error || !data) {
      // Güvenlik: Aynı hata mesajı
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const adminUser = data;

    // Passwort verifizieren - Verify password
    const isPasswordValid = await verifyPassword(password, adminUser.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // JWT-Token erstellen - Create JWT token
    const token = createToken({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
    });

    // Erfolgreiche Antwort mit Cookie - Successful response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged in",
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
      },
    });

    // Sicheres HTTP-Only Cookie setzen - Set secure HTTP-only cookie
    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 }
    );
  }
}
