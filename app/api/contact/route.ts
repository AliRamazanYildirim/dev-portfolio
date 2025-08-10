import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
export const runtime = "nodejs"; // Node-APIs (crypto) sicherstellen

// POST /api/kontakt - Kontaktmeldung speichern
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Einfache Validierung
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    // E-Mail-Formatprüfung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Nachricht in der Datenbank speichern (Supabase)
    const id = randomUUID();
    const { data: inserted, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          id,
          name,
          email,
          message,
          // read: false, // hat default
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("contact insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send message",
          details: (error as any)?.message,
          hint: (error as any)?.hint,
          code: (error as any)?.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: inserted,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// GET /api/contact - Holen dich die Kontaktmeldungen (für Admin).
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get("unread");
    const limit = searchParams.get("limit");

    // Nachrichten abrufen (Supabase)
    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("createdAt", { ascending: false });
    if (unreadOnly === "true") {
      query = query.eq("read", false);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;
    if (error) {
      console.error("contact fetch error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
