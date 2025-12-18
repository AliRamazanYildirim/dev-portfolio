import { NextResponse } from "next/server";
import { getDiscountsEnabled, setDiscountsEnabled } from "@/lib/discountSettings";

export async function GET() {
    try {
        const enabled = await getDiscountsEnabled();
        return NextResponse.json({ success: true, data: { enabled } });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to load discounts setting" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { enabled } = body as { enabled?: unknown };

        if (typeof enabled !== "boolean") {
            return NextResponse.json(
                { success: false, error: "'enabled' must be a boolean" },
                { status: 400 }
            );
        }

        const saved = await setDiscountsEnabled(enabled);
        return NextResponse.json({ success: true, data: { enabled: saved } });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to update discounts setting" },
            { status: 500 }
        );
    }
}
