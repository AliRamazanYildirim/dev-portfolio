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

    // Wenn es einen Referenzcode gibt, bearbeite ihn - BELOHNE DEN VORSCHLAGENDEN
    let referrerCode = null;
    let referrerDiscount = 0;

    // NEUKUNDE ZAHLT DEN NORMALEN PREIS - EMPFEHLER ERHÄLT EINEN RABATT
    let finalPrice = body.price || 0; // Ein neuer Kunde zahlt den normalen Preis.
    let discountRate = 0; // Ein neuer Kunde erhält keinen Rabatt.

    if (body.reference && body.price) {
      // Referans kodunu doğrula
      const { data: referrer, error: referrerError } = await supabaseAdmin
        .from("customers")
        .select("id, myReferralCode, referralCount, price")
        .eq("myReferralCode", body.reference)
        .single();

      if (referrer && !referrerError && referrer.price) {
        referrerCode = referrer.myReferralCode;

        // Berechne den Rabatt auf den Preis des EMPFEHLERS (%3 + weitere %3 für jede Referenz, maximal %15)
        const currentReferralCount = referrer.referralCount || 0;
        referrerDiscount = 3 + currentReferralCount * 3; // Erst %3, dann schrittweise
        referrerDiscount = Math.min(referrerDiscount, 15); // Max %15

        const referrerFinalPrice =
          referrer.price - (referrer.price * referrerDiscount) / 100;

        console.log("Referenzvorgang - EMPFEHLER BELOHNEN:", {
          referrer: referrer.id,
          currentCount: currentReferralCount,
          newCount: currentReferralCount + 1,
          referrerDiscount,
          referrerOriginalPrice: referrer.price,
          referrerFinalPrice,
        });

        // Referenzzähler aktualisieren UND den Preis des Vorschlagenden rabattieren
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
          console.error("Vorgeschlagener Aktualisierungsfehler:", updateError);
        }
      }
    }

    // Generate a unique reference code
    const generateReferralCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let myReferralCode = generateReferralCode();

    // Generiere erneut, bis der Code einzigartig ist.
    while (true) {
      const { data: existing } = await supabaseAdmin
        .from("customers")
        .select("myReferralCode")
        .eq("myReferralCode", myReferralCode)
        .single();

      if (!existing) break;
      myReferralCode = generateReferralCode();
    }

    // Kundendaten vorbereiten - NEUER KUNDE KOMMT ZUM NORMALEN PREIS
    const customerData = {
      id: createId(), // CUID erstellen
      firstname: body.firstname,
      lastname: body.lastname,
      companyname: body.companyname,
      email: body.email,
      phone: body.phone,
      address: body.address,
      reference: body.reference, // Welchen Referenzcode du verwendet hast, notiere.
      price: body.price, // Originalpreis (KEIN Rabatt)
      myReferralCode,
      finalPrice: body.price, // Ein neuer Kunde zahlt den normalen Preis.
      discountRate: null, // Yeniem Kunden gibt es keinen Rabatt.
      referralCount: 0,
      totalEarnings: 0,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Kunden speichern
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

    // Wenn ein Referenzvorgang vorliegt, speichern.
    if (referrerCode && referrerDiscount > 0) {
      await supabaseAdmin.from("referral_transactions").insert([
        {
          referrerCode,
          newCustomerId: customer.id,
          discountRate: referrerDiscount,
          originalPrice: body.price, // Preis für den neuen Kunden
          finalPrice: body.price, // Der neue Kunde zahlte den normalen Preis.
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
              message: `Der empfehlende Kunde hat ${referrerDiscount}% Rabatt erhalten!`,
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
