import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server"; // service_role (server-only)
import { randomUUID } from "crypto";
import { getIpFromHeaders } from "@/lib/ip";

export const runtime = "nodejs"; // Supabase/crypto için Node runtime

// ---- Grenzen (je nach Bedarf anpassen) ----
const RL_POST = { limit: 10, window: 60 }; // 20 POST pro Minute
const RL_GET  = { limit: 60, window: 60 }; // 60 GET pro Minute
// ---------------------------------------------

type RLMeta = {
  limit: number;
  remaining: number;
  reset: number; // epoch seconds
};

async function checkRateLimit(
  req: NextRequest,
  scope: "GET" | "POST"
): Promise<{ allowed: true; meta: RLMeta } | { allowed: false; meta: RLMeta }> {
  const ip = getIpFromHeaders(req.headers);
  const key = `ip:${ip}:/api/contact:${scope}`;
  const { limit, window } = scope === "POST" ? RL_POST : RL_GET;

  const { data, error } = await supabaseAdmin.rpc("hit_rate_limit", {
    p_key: key,
    p_window_seconds: window,
    p_limit: limit,
  });

  if (error) {
    // fail-closed: Blockiere die Anfrage, wenn der Ratenbegrenzer ausfällt
    throw new Error(`rate_limit rpc error: ${error.message}`);
  }

  // Supabase, gibt für RETURNS TABLE ein Array zurück
  const row = Array.isArray(data) ? data[0] : data;
  const success = !!row?.success;
  const meta: RLMeta = {
    limit: Number(row?.limit ?? limit),
    remaining: Number(row?.remaining ?? 0),
    reset: Number(row?.reset ?? 0),
  };

  return success ? { allowed: true, meta } : { allowed: false, meta };
}

function attachRLHeaders(res: NextResponse, meta: RLMeta) {
  res.headers.set("X-RateLimit-Limit", String(meta.limit));
  res.headers.set("X-RateLimit-Remaining", String(meta.remaining));
  res.headers.set("X-RateLimit-Reset", String(meta.reset));
}

/** POST /api/contact — Nachricht speichern */
export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit(request, "POST");
    if (!rl.allowed) {
      const retryAfter = Math.max(0, rl.meta.reset - Math.floor(Date.now() / 1000));
      const blocked = NextResponse.json(
        { success: false, error: "Too many requests! Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
      attachRLHeaders(blocked, rl.meta);
      return blocked;
    }

    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email and message are required" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const { data: inserted, error } = await supabaseAdmin
      .from("contact_messages")
      .insert([{ id, name, email, message }])
      .select()
      .single();

    if (error) {
      console.error("contact insert error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to send message", details: (error as any)?.message },
        { status: 500 }
      );
    }

    const res = NextResponse.json(
      { success: true, data: inserted, message: "Message sent successfully" },
      { status: 201 }
    );
    attachRLHeaders(res, rl.meta);
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Rate limiter failed" }, { status: 500 });
  }
}

/** GET /api/contact — Nachrichten auflisten (Admin)*/
export async function GET(request: NextRequest) {
  try {
    const rl = await checkRateLimit(request, "GET");
    if (!rl.allowed) {
      const retryAfter = Math.max(0, rl.meta.reset - Math.floor(Date.now() / 1000));
      const blocked = NextResponse.json(
        { success: false, error: "Too many requests! Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
      attachRLHeaders(blocked, rl.meta);
      return blocked;
    }

    const params = request.nextUrl.searchParams;
    const unreadOnly = params.get("unread") === "true";
    const limit = Number(params.get("limit") ?? 0);

    let query = supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("createdAt", { ascending: false });

    if (unreadOnly) query = query.eq("read", false);
    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("contact fetch error:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
    }

    const res = NextResponse.json({
      success: true,
      data: data ?? [],
      count: data?.length ?? 0,
    });
    attachRLHeaders(res, rl.meta);
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Rate limiter failed" }, { status: 500 });
  }
}
