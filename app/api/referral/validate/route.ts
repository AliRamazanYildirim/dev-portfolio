import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Überprüfe den Referenzcode und berechnen Sie den Rabatt
export async function POST(request: Request) {
  try {
    const { referralCode, basePrice } = await request.json();

    if (!referralCode || !basePrice) {
      return NextResponse.json(
        { success: false, error: "Referral code and base price are required" },
        { status: 400 }
      );
    }

    // Kunden mit Referenzcode finden
    const { data: referrer, error: referrerError } = await supabaseAdmin
      .from("customers")
      .select("id, firstname, lastname, myReferralCode, referralCount")
      .eq("myReferralCode", referralCode)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { success: false, error: "Invalid referral code" },
        { status: 404 }
      );
    }

    // Referenzstufe basierend auf Rabatt berechnen  
    // Erste 3 % + 3 % für jeden weiteren Referenz, maximal 15 %  
    const currentReferralCount = referrer.referralCount || 0;
    let discountRate = 3 + currentReferralCount * 3; // Erst %3, dann schrittweise
    discountRate = Math.min(discountRate, 15); // Maximal %15 Rabatt

    // Berechne den reduzierten Preis
    const discountAmount = (basePrice * discountRate) / 100;
    const finalPrice = basePrice - discountAmount;

    return NextResponse.json({
      success: true,
      data: {
        referrer: {
          name: `${referrer.firstname} ${referrer.lastname}`,
          referralCount: referrer.referralCount,
        },
        discount: {
          rate: discountRate,
          amount: discountAmount,
          originalPrice: basePrice,
          finalPrice: finalPrice,
          referralLevel: Math.ceil(discountRate / 3), // Ihre %3 jede Ebene
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
