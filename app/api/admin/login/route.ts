import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

    // Admin-Benutzer in der Datenbank finden - Find admin user in database
    const adminUser = await db.adminUser.findUnique({
      where: {
        email: email.toLowerCase().trim(),
        active: true, // Nur aktive Benutzer - Only active users
      },
    });

    if (!adminUser) {
      // Sicherheit: Gleiche Fehlermeldung für ungültiges E-Mail/Passwort
      // Security: Same error message for invalid email/password
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

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
