import { NextResponse } from "next/server";
import { DiscountEmailService } from "@/app/api/admin/discounts/service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactionId, discountRate } = body;

        const result = await DiscountEmailService.sendEmail(transactionId, discountRate);

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
    } catch (error: any) {
        console.error("Failed to send discount email:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to send email" },
            { status: 500 }
        );
    }
}
