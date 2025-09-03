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

    // Referans kodu varsa işle
    let finalPrice = body.price;
    let discountRate = 0;
    let referrerCode = null;

    if (body.reference && body.price) {
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

        console.log("Referans işlemi:", {
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

    // Müşteri verisini hazırla
    const customerData = {
      id: createId(), // CUID oluştur
      firstname: body.firstname,
      lastname: body.lastname,
      companyname: body.companyname,
      email: body.email,
      phone: body.phone,
      address: body.address,
      reference: body.reference,
      price: body.price, // Orijinal fiyat
      myReferralCode,
      finalPrice, // İndirimli fiyat
      discountRate: discountRate > 0 ? discountRate : null,
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
    if (referrerCode && discountRate > 0) {
      await supabaseAdmin.from("referral_transactions").insert([
        {
          referrerCode,
          newCustomerId: customer.id,
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
      data: customer,
      referralApplied: discountRate > 0,
      discount:
        discountRate > 0
          ? {
              rate: discountRate,
              originalPrice: body.price,
              finalPrice,
              savings: body.price - finalPrice,
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
