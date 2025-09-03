import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET, PUT, DELETE: Einzelne Kundenoperationen

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Mevcut müşteriyi getir
    const { data: existingCustomer, error: fetchError } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingCustomer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // Referans kodu değişikliği kontrolü
    let finalPrice = body.price;
    let discountRate = existingCustomer.discountRate; // Mevcut indirim oranını koru
    let referrerCode = null;

    // Eğer yeni referans kodu girildiyse ve önceden referans kullanılmamışsa
    if (
      body.reference &&
      body.reference !== existingCustomer.reference &&
      body.price &&
      !existingCustomer.discountRate
    ) {
      // Referans kodunu doğrula
      const { data: referrer, error: referrerError } = await supabaseAdmin
        .from("customers")
        .select("id, myReferralCode, referralCount")
        .eq("myReferralCode", body.reference)
        .single();

      if (referrer && !referrerError) {
        referrerCode = referrer.myReferralCode;

        // İndirim hesapla (%5 + her referans için %5 daha)
        const currentReferralCount = referrer.referralCount || 0;
        discountRate = 5 + currentReferralCount * 5; // İlk %5, sonra kademeli
        discountRate = Math.min(discountRate, 50); // Max %50
        finalPrice = body.price - (body.price * discountRate) / 100;

        console.log("PUT Referans işlemi:", {
          customerId: id,
          referrer: referrer.id,
          currentCount: currentReferralCount,
          newCount: currentReferralCount + 1,
          discountRate,
          originalPrice: body.price,
          finalPrice,
        });

        // Referans sayacını güncelle
        const { error: updateError } = await supabaseAdmin
          .from("customers")
          .update({
            referralCount: currentReferralCount + 1,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", referrer.id);

        if (updateError) {
          console.error("Referans sayacı güncellenirken hata:", updateError);
        }
      }
    }

    // Güncelleme verilerini hazırla
    const updateData = {
      ...body,
      finalPrice: finalPrice,
      discountRate: discountRate,
      updatedAt: new Date().toISOString(),
    };

    // created_at'ı koruma
    if (updateData.created_at) delete updateData.created_at;
    if (updateData.createdAt) delete updateData.createdAt;

    // Müşteriyi güncelle
    const { data, error } = await supabaseAdmin
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Customer update error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Referans işlemi varsa kaydet
    if (referrerCode && discountRate > existingCustomer.discountRate) {
      await supabaseAdmin.from("referral_transactions").insert([
        {
          referrerCode,
          newCustomerId: id,
          discountRate,
          originalPrice: body.price,
          finalPrice,
          referralLevel: Math.ceil(discountRate / 5),
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      data,
      referralApplied: discountRate > (existingCustomer.discountRate || 0),
      discount:
        discountRate > (existingCustomer.discountRate || 0)
          ? {
              rate: discountRate,
              originalPrice: body.price,
              finalPrice,
              savings: body.price - finalPrice,
            }
          : null,
    });
  } catch (error: any) {
    console.error("PUT customer error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { error } = await supabaseAdmin.from("customers").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true });
}
