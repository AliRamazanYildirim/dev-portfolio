import { NextResponse } from "next/server";
import { validateReferral } from "./service";
import { getDiscountsEnabled } from "@/lib/discountSettings";

// Route handler delegates to service for validation and discount calculation
export async function POST(request: Request) {
  try {
    const { referralCode, basePrice } = await request.json();

    if (!referralCode || basePrice === undefined || basePrice === null) {
      return NextResponse.json(
        { success: false, error: "Referral code and base price are required" },
        { status: 400 }
      );
    }

    const discountsEnabled = await getDiscountsEnabled();
    if (!discountsEnabled) {
      return NextResponse.json(
        { success: false, error: "Discounts are disabled" },
        { status: 409 }
      );
    }

    const numericBasePrice = Number(basePrice);
    if (Number.isNaN(numericBasePrice)) {
      return NextResponse.json(
        { success: false, error: "Base price must be a number" },
        { status: 400 }
      );
    }

    const result = await validateReferral({
      referralCode,
      basePrice: numericBasePrice,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    if (error?.message === "Invalid referral code") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
