import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createId } from "@paralleldrive/cuid2";

// GET: Bringe alle Kunden. Unterstützt Query-Parameter:
// - sort=price.asc | price.desc | name.asc
// - from=YYYY-MM-DD (inclusive)
// - to=YYYY-MM-DD (inclusive)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const q = searchParams.get("q");

    let query: any = supabaseAdmin.from("customers").select("*");

    if (from && to) {
      // If user passed YYYY-MM-DD convert to full ISO interval
      const fromIso = from.length === 10 ? `${from}T00:00:00Z` : from;
      const toIso = to.length === 10 ? `${to}T23:59:59Z` : to;
      query = query.gte("created_at", fromIso).lte("created_at", toIso);
    }

    // If q provided, search across multiple fields (firstname, lastname, companyname, address, reference)
    if (q) {
      const pattern = `%${q.replace(/%/g, "")}%`;
      // Supabase `or` can be used to OR multiple ilike conditions
      // note: use double quotes around column names not needed here
      query = query.or(
        `firstname.ilike.${pattern},lastname.ilike.${pattern},companyname.ilike.${pattern},address.ilike.${pattern},reference.ilike.${pattern}`
      );
    }

    if (sort) {
      const [field, dir] = sort.split(".");
      const ascending = dir === "asc";
      if (field === "price") {
        query = query.order("price", { ascending });
      } else if (field === "name") {
        query = query
          .order("firstname", { ascending })
          .order("lastname", { ascending });
      } else if (field === "created") {
        query = query.order("created_at", { ascending });
      }
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// POST: Neuen Kunden hinzufügen
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Referans kodu varsa işle - ÖNERENİ ÖDÜLLENDIR
    let referrerCode = null;
    let referrerDiscount = 0;

    // YENİ MÜŞTERİ NORMAL FİYAT ÖDER - REFERRER İNDİRİM ALIR
    let finalPrice = body.price || 0; // Yeni müşteri normal fiyat öder
    let discountRate = 0; // Yeni müşteri indirim almaz

    if (body.reference && body.price) {
      // Referans kodunu doğrula
      const { data: referrer, error: referrerError } = await supabaseAdmin
        .from("customers")
        .select("id, myReferralCode, referralCount, price")
        .eq("myReferralCode", body.reference)
        .single();

      if (referrer && !referrerError && referrer.price) {
        referrerCode = referrer.myReferralCode;

        // ÖNERENİN fiyatına indirim hesapla (%3 + her referans için %3 daha, maksimum %15)
        const currentReferralCount = referrer.referralCount || 0;
        referrerDiscount = 3 + currentReferralCount * 3; // İlk %3, sonra kademeli
        referrerDiscount = Math.min(referrerDiscount, 15); // Max %15

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

        // Referans sayacını güncelle VE önerenin fiyatını indirimli yap
        const { error: updateError } = await supabaseAdmin
          .from("customers")
          .update({
            referralCount: currentReferralCount + 1,
            discountRate: referrerDiscount,
            finalPrice: referrerFinalPrice,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", referrer.id);

        if (updateError) {
          console.error("Öneren güncelleme hatası:", updateError);
        }
      }
    }

    // Benzersiz referans kodu oluştur
    const generateReferralCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let myReferralCode = generateReferralCode();

    // Kod benzersiz olana kadar yeniden oluştur
    while (true) {
      const { data: existing } = await supabaseAdmin
        .from("customers")
        .select("myReferralCode")
        .eq("myReferralCode", myReferralCode)
        .single();

      if (!existing) break;
      myReferralCode = generateReferralCode();
    }

    // Müşteri verisini hazırla - YENİ MÜŞTERİ NORMAL FİYATA GELİR
    const customerData = {
      id: createId(), // CUID oluştur
      firstname: body.firstname,
      lastname: body.lastname,
      companyname: body.companyname,
      email: body.email,
      phone: body.phone,
      address: body.address,
      reference: body.reference, // Hangi referans kodunu kullandığını kaydet
      price: body.price, // Orijinal fiyat (indirim YOK)
      myReferralCode,
      finalPrice: body.price, // Yeni müşteri normal fiyat öder
      discountRate: null, // Yeni müşteriye indirim yok
      referralCount: 0,
      totalEarnings: 0,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Müşteriyi kaydet
    const { data: customer, error } = await supabaseAdmin
      .from("customers")
      .insert([customerData])
      .select()
      .single();

    if (error) {
      console.error("Customer insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Referans işlemi varsa kaydet
    if (referrerCode && referrerDiscount > 0) {
      await supabaseAdmin.from("referral_transactions").insert([
        {
          referrerCode,
          newCustomerId: customer.id,
          discountRate: referrerDiscount,
          originalPrice: body.price, // Yeni müşterinin fiyatı
          finalPrice: body.price, // Yeni müşteri normal fiyat ödedi
          referralLevel: Math.ceil(referrerDiscount / 3),
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      data: customer,
      referralApplied: referrerDiscount > 0,
      referrerDiscount:
        referrerDiscount > 0
          ? {
              rate: referrerDiscount,
              message: `Öneren müşteri ${referrerDiscount}% indirim kazandı!`,
            }
          : null,
    });
  } catch (error: any) {
    console.error("POST customer error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
