import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET, PUT, DELETE: Tek müşteri işlemleri

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { data, error } = await supabaseAdmin.from("customers").select("*").eq("id", id).single();
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from("customers").update(body).eq("id", id).select();
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: data[0] });
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { error } = await supabaseAdmin.from("customers").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
