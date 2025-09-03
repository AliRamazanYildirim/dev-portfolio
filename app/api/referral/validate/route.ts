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
    // İlk %5 + her referans için %5 daha
    const currentReferralCount = referrer.referralCount || 0;
    let discountRate = 5 + currentReferralCount * 5; // İlk %5, sonra kademeli
    discountRate = Math.min(discountRate, 50); // Max %50 indirim

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
          referralLevel: currentReferralCount + 1,
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
