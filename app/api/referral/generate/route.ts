import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Müşteri için yeni referans kodu oluştur
export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Müşteriyi kontrol et
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("id, myReferralCode, firstname, lastname")
      .eq("id", customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        referralCode: customer.myReferralCode,
        customerName: `${customer.firstname} ${customer.lastname}`,
        shareMessage: `Merhaba! 🎉

Ben ${customer.firstname} ${customer.lastname} olarak, web geliştirme projeleriniz için Ali Ramazan Yıldırım'ı tavsiye ediyorum!

✨ Özel referans kodumla %5 indirim kazanabilirsiniz: ${customer.myReferralCode}

🚀 Profesyonel web siteleri, e-ticaret çözümleri ve mobil uygulamalar için hemen iletişime geçin!

📩 İletişim: hello@aliramazan.dev
🌐 Portfolio: aliramazan.dev

#WebGeliştirme #Referans #İndirim`,
        shareUrl: `https://aliramazan.dev?ref=${customer.myReferralCode}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// Referans kodunun istatistiklerini getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Müşteriyi ve referans verilerini getir
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .select(
        "id, myReferralCode, referralCount, totalEarnings, firstname, lastname"
      )
      .eq("id", customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // Referans işlemlerini getir
    const { data: transactions, error: transactionsError } = await supabaseAdmin
      .from("referral_transactions")
      .select("*")
      .eq("referrerCode", customer.myReferralCode)
      .order("createdAt", { ascending: false });

    return NextResponse.json({
      success: true,
      data: {
        customer: {
          name: `${customer.firstname} ${customer.lastname}`,
          referralCode: customer.myReferralCode,
          referralCount: customer.referralCount,
          totalEarnings: customer.totalEarnings || 0,
        },
        transactions: transactions || [],
        stats: {
          totalReferrals: customer.referralCount,
          totalSavingsProvided:
            transactions?.reduce(
              (sum, t) => sum + (t.originalPrice - t.finalPrice),
              0
            ) || 0,
          averageDiscountRate: transactions?.length
            ? transactions.reduce((sum, t) => sum + t.discountRate, 0) /
              transactions.length
            : 0,
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
