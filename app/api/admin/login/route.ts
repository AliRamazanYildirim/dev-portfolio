import { NextRequest, NextResponse } from "next/server";
import { adminRepository } from "@/lib/repositories";
import { verifyPassword, createToken, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth";

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1️⃣ Input validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // 3️⃣ Admin-Benutzerabfrage via Repository
    const adminUser = await adminRepository.findActiveByEmail(email.toLowerCase().trim());

    if (!adminUser) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }
    // 4️⃣ Passwortüberprüfung
    const isPasswordValid = await verifyPassword(password, adminUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5️⃣ JWT-Token erstellen
    const token = createToken({ id: adminUser._id.toString(), email: adminUser.email, name: adminUser.name });

    // 6️⃣ Antwort erstellen und Cookie setzen
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged in",
      user: { id: adminUser._id.toString(), email: adminUser.email, name: adminUser.name },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
