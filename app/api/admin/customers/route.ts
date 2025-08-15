import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET: Tüm müşterileri getir
export async function GET() {
  const { data, error } = await supabaseAdmin.from("customers").select("*");
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

// POST: Yeni müşteri ekle
export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from("customers").insert([body]).select();
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: data[0] });
}
