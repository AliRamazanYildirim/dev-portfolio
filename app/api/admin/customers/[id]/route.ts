import { NextResponse } from "next/server";
import { CustomersService } from "@/app/api/admin/customers/service";

// GET: Einzelnen Kunden abrufen
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await CustomersService.getById(id);

  if (!data) {
    return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data });
}

// PUT: Kunden aktualisieren
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const result = await CustomersService.updateById(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: (result as any).status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      referralApplied: result.referralApplied,
      referrerReward: result.referrerReward,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Kunden löschen
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    try {
      const result = await CustomersService.deleteById(id);
      return NextResponse.json(result);
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
