import { NextRequest, NextResponse } from "next/server";
import { contactRepository } from "@/lib/repositories";
import { randomUUID } from "crypto";
import { getIpFromHeaders } from "@/lib/ip";
import { checkRateLimitKey } from "@/lib/mongoRateLimiter";

export const runtime = "nodejs"; // Supabase/crypto için Node runtime

// ---- Grenzen (je nach Bedarf anpassen) ----
const RL_POST = { limit: 3, window: 60 }; // 3 POST pro Minute
const RL_GET = { limit: 60, window: 60 }; // 60 GET pro Minute
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

  try {
    const data = await checkRateLimitKey(key, window, limit)
    return data.allowed ? { allowed: true, meta: data.meta } : { allowed: false, meta: data.meta }
  } catch (err: any) {
    console.error("rate_limit error:", err?.message || err);
    throw new Error(`rate_limit error: ${err?.message || String(err)}`);
  }
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
    const inserted = await contactRepository.create({ data: { id, name, email, message, createdAt: new Date() } });
    const res = NextResponse.json({ success: true, data: inserted, message: "Message sent successfully" }, { status: 201 });
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

    const where: any = {};
    if (unreadOnly) where.read = false;
    const query = await contactRepository.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit || undefined });
    const res = NextResponse.json({ success: true, data: query ?? [], count: query?.length ?? 0 });
    attachRLHeaders(res, rl.meta);
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Rate limiter failed" }, { status: 500 });
  }
}
