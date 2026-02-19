import { NextResponse } from "next/server";
import { CustomersService } from "@/app/api/admin/customers/service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId } = body;
        if (!customerId) {
            return NextResponse.json({ success: false, error: "customerId is required" }, { status: 400 });
        }

        const result = await CustomersService.recalcFinalPrice(String(customerId));

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: (result as any).status || 500 }
            );
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (err: any) {
        console.error("Failed to recalc final price:", err);
        return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
    }
}
