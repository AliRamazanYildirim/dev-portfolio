import { NextResponse } from "next/server";
import { CustomersService } from "./service";
import { validateCreateCustomerBody } from "./validation";

/**
 * GET /api/admin/customers
 * Query params: sort, from, to, q
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await CustomersService.list({
      sort: searchParams.get("sort"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
      q: searchParams.get("q"),
    });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[GET /api/admin/customers]", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/customers — Neuen Kunden hinzufügen
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Input validieren
    const validation = validateCreateCustomerBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 2. Service aufrufen
    const customer = await CustomersService.create(validation.value);
    return NextResponse.json({ success: true, data: customer });
  } catch (err: any) {
    const msg = err?.message || String(err);

    // Duplicate-Key → 409
    if (msg.includes("duplicate key value") || msg.includes("unique constraint") || (err?.code === 11000)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This email address is already registered. Each customer must have a unique email address.",
        },
        { status: 409 },
      );
    }

    console.error("[POST /api/admin/customers]", err);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 },
    );
  }
}
