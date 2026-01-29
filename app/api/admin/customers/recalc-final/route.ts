import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import CustomerModel from "@/models/Customer";
import {
    calcDiscountedPrice,
    calcTotalEarnings,
} from "@/app/api/admin/customers/lib/referral";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId } = body;
        if (!customerId) {
            return NextResponse.json({ success: false, error: "customerId is required" }, { status: 400 });
        }

        await connectToMongo();

        const customer = await CustomerModel.findById(String(customerId)).exec();
        if (!customer) {
            return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
        }

        const basePrice = typeof customer.price === "number" ? Number(customer.price) : 0;
        const refCount = typeof customer.referralCount === "number" ? customer.referralCount : 0;

        // Compute iterative discounted price using referral count (includes bonus steps)
        const newFinal = calcDiscountedPrice(basePrice, refCount);

        const totalEarnings = calcTotalEarnings(basePrice, refCount);

        await CustomerModel.findByIdAndUpdate(customer._id, {
            finalPrice: newFinal,
            totalEarnings,
            updatedAt: new Date(),
        }).exec();

        return NextResponse.json({ success: true, data: { id: customer._id, finalPrice: newFinal, totalEarnings } });
    } catch (err: any) {
        console.error("Failed to recalc final price:", err);
        return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
    }
}
