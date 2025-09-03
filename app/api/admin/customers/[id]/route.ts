import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET: Einzelnen Kunden abrufen
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

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "Customer not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}

// PUT: Kunden aktualisieren
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Mevcut müşteri bilgilerini al
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

    // Referans kodu ekleniyorsa işle - ÖNERENİ ÖDÜLLENDIR
    let referrerDiscount = 0;
    let referrerCode = null;

    if (body.reference && body.price && !existingCustomer.reference) {
      // Bu müşteriye ilk kez referans kodu ekleniyorsa
      const { data: referrer, error: referrerError } = await supabaseAdmin
        .from("customers")
        .select("id, myReferralCode, referralCount, price")
        .eq("myReferralCode", body.reference)
        .single();

      if (referrer && !referrerError && referrer.price) {
        referrerCode = referrer.myReferralCode;

        // ÖNERENİN fiyatına indirim hesapla
        const currentReferralCount = referrer.referralCount || 0;
        referrerDiscount = 3 + currentReferralCount * 3;
        referrerDiscount = Math.min(referrerDiscount, 15);

        const referrerFinalPrice =
          referrer.price - (referrer.price * referrerDiscount) / 100;

        console.log("Referans işlemi - ÖNERENİ ÖDÜLLENDIR:", {
          referrer: referrer.id,
          currentCount: currentReferralCount,
          newCount: currentReferralCount + 1,
          referrerDiscount,
          referrerOriginalPrice: referrer.price,
          referrerFinalPrice,
        });

        // Önerenin bilgilerini güncelle
        await supabaseAdmin
          .from("customers")
          .update({
            referralCount: currentReferralCount + 1,
            discountRate: referrerDiscount,
            finalPrice: referrerFinalPrice,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", referrer.id);

        // Referans işlemi kaydet
        await supabaseAdmin.from("referral_transactions").insert([
          {
            referrerCode,
            newCustomerId: existingCustomer.id,
            discountRate: referrerDiscount,
            originalPrice: body.price,
            finalPrice: body.price, // Güncellenen müşteri normal fiyat öder
            referralLevel: Math.ceil(referrerDiscount / 3),
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    }

    // Güncelleme verilerini hazırla - GÜNCELLENENE İNDİRİM YOK
    const updateData = {
      ...body,
      finalPrice: body.price, // Güncellenen müşteri normal fiyat öder
      discountRate: existingCustomer.discountRate, // Mevcut indirim oranını koru
      updatedAt: new Date().toISOString(),
    };

    const { data: result, error } = await supabaseAdmin
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      referralApplied: referrerDiscount > 0,
      referrerReward:
        referrerDiscount > 0
          ? {
              rate: referrerDiscount,
              message: `Öneren müşteri ${referrerDiscount}% indirim kazandı!`,
            }
          : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Kunden löschen
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
