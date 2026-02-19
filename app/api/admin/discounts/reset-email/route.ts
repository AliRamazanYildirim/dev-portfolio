import { NextResponse } from "next/server";
import { DiscountEmailService } from "@/app/api/admin/discounts/service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactionId, sendCorrectionEmail = true } = body;

        const result = await DiscountEmailService.resetEmail(transactionId, sendCorrectionEmail);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: (result as any).status || 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
        });
    } catch (error: unknown) {
        console.error("Failed to reset email status:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to reset email status";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
