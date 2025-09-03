import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Referans kodunu doğrula ve indirim hesapla
export async function POST(request: Request) {
  try {
    const { referralCode, basePrice } = await request.json();

    if (!referralCode || !basePrice) {
      return NextResponse.json(
        { success: false, error: "Referral code and base price are required" },
        { status: 400 }
      );
    }

    // Referans koduna sahip müşteriyi bul
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

    // Referans seviyesine göre indirim hesapla
    // İlk %3 + her referans için %3 daha, maksimum %15
    const currentReferralCount = referrer.referralCount || 0;
    let discountRate = 3 + currentReferralCount * 3; // İlk %3, sonra kademeli
    discountRate = Math.min(discountRate, 15); // Max %15 indirim

    // İndirimli fiyatı hesapla
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
          referralLevel: Math.ceil(discountRate / 3), // Her %3 bir seviye
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
