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

// Assistent: Neuer Empfehlungsrabatt (3% + zusätzlich 3% pro Empfehlung, max. 15%)
function calcReferrerDiscount(nextReferralCount: number) {
  const base = 3 + (nextReferralCount - 1) * 3;
  return Math.min(base, 15);
}

// Helfer: Erstelle einen 8-stelligen Empfehlungscode
function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Bereite den E-Mail-Inhalt für den Referrer vor.
function buildReferrerEmail({
  refFirst,
  refLast,
  refEmail,
  myReferralCode,
  newCount,
  discountRate,
  newCustomerFullname,
  referrerPrice,
}: {
  refFirst: string;
  refLast: string;
  refEmail: string;
  myReferralCode: string;
  newCount: number;
  discountRate: number;
  newCustomerFullname?: string;
  referrerPrice?: number;
}) {
  const hasReachedMaximum = newCount >= 5;
  const savings = referrerPrice ? (referrerPrice * discountRate) / 100 : 0;

  const emailContent = `
Hallo ${refFirst} ${refLast},

🎉 HERZLICHEN GLÜCKWUNSCH! 🎉

Eine neue Person hat Ihren Empfehlungscode ${myReferralCode} verwendet und Sie haben dadurch einen zusätzlichen Rabatt erhalten!

📈 Ihre aktuelle Situation:
• Empfehlungen gesamt: ${newCount}
• Ihr neuer Rabattsatz: ${discountRate}%
• Ihre Ersparnis: €${savings.toFixed(2)}

💳 RABATT-AUSZAHLUNG:
Teilen Sie uns Ihre IBAN-Daten mit und wir überweisen Ihnen den Rabattbetrag von €${savings.toFixed(
    2
  )} innerhalb von maximal einer Woche auf Ihr Bankkonto!

📧 IBAN senden an: aliramazanyildirim@gmail.com
⏰ Auszahlungsdauer: Maximal 7 Werktage nach IBAN-Erhalt
${
  hasReachedMaximum
    ? `
🏆 MAXIMUM ERREICHT!
Sie haben das Maximum von 5 Empfehlungen erreicht und sichern sich dauerhaft 15% Rabatt auf alle zukünftigen Projekte! Gratulation zu dieser fantastischen Leistung!
`
    : `
✨ Noch ${5 - newCount} Empfehlungen bis zum Maximum von 15% Rabatt!
`
}
💰 Rabattstaffel:
• 1. Empfehlung → 3% Rabatt
• 2. Empfehlung → 6% Rabatt  
• 3. Empfehlung → 9% Rabatt
• 4. Empfehlung → 12% Rabatt
• 5. Empfehlung → 15% Rabatt (Maximum)

🚀 Teilen Sie Ihren Code weiter:
👉 ${myReferralCode}

🌐 Meine Dienstleistungen:
• Professionelle Websites
• E-Commerce-Lösungen
• Mobile Anwendungen
• Maßgeschneiderte Webentwicklung

💡 Jetzt aktiv werden:
Teilen Sie Ihren Code noch heute mit Freunden, Geschäftspartnern oder Kollegen und verwandeln Sie jede Empfehlung in einen Vorteil!

📧 Kontakt: aliramazanyildirim@gmail.com
🌐 Portfolio: https://dev-portfolio-obhj.onrender.com

Vielen Dank, dass Sie mein Netzwerk erweitern und anderen helfen, professionelle Webentwicklungsdienstleistungen zu erhalten!

Herzliche Grüße
Ali Ramazan Yildirim
Fullstack Web Developer & UI/UX Designer

---
Diese E-Mail wurde automatisch generiert. Bei Fragen wenden Sie sich bitte an aliramazanyildirim@gmail.com
  `.trim();

  const emailParams = {
    to_email: refEmail,
    to_name: `${refFirst} ${refLast}`,
    subject: `🎉 Danke für Ihre Empfehlung! ${discountRate}% Rabatt erhalten - ${myReferralCode}`,
    message: emailContent,
    from_name: "Ali Ramazan Yildirim",
    reply_to: "aliramazanyildirim@gmail.com",
  };

  return { emailContent, emailParams };
}

// POST: Neuen Kunden hinzufügen
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Wenn er mit einem Referenzcode gekommen ist: Finde die Person, die ihn empfohlen hat, aktualisiere den Rabatt und bereite die E-Mail vor.
    let referrerCode: string | null = null;
    let referrerDiscount = 0;
    let referrerEmailBundle: {
      emailContent: string;
      emailParams: {
        to_email: string;
        to_name: string;
        subject: string;
        message: string;
        from_name: string;
        reply_to: string;
      };
    } | null = null;

    // NEUKUNDE ZAHLT DEN NORMALEN PREIS
    const finalPriceForNewCustomer = body.price || 0;

    if (body.reference && body.price) {
      // Referenz überprüfen + Name/Nachname/E-Mail für die E-Mail abrufen
      const { data: referrer, error: referrerError } = await supabaseAdmin
        .from("customers")
        .select(
          "id, myReferralCode, referralCount, price, firstname, lastname, email"
        )
        .eq("myReferralCode", body.reference)
        .single();

      if (referrer && !referrerError && referrer.price) {
        referrerCode = referrer.myReferralCode;

        const currentReferralCount = referrer.referralCount || 0;
        const newReferralCount = currentReferralCount + 1;

        // Neuer Rabattprozentsatz (3 + für jede Empfehlung +3, max. 15)
        referrerDiscount = calcReferrerDiscount(newReferralCount);

        const referrerFinalPrice =
          referrer.price - (referrer.price * referrerDiscount) / 100;

        // Update Referrer
        const { error: updateError } = await supabaseAdmin
          .from("customers")
          .update({
            referralCount: newReferralCount,
            discountRate: referrerDiscount,
            finalPrice: referrerFinalPrice,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", referrer.id);

        if (updateError) {
          console.error("Vorgeschlagener Aktualisierungsfehler:", updateError);
        } else {
          // Bereite den E-Mail-Inhalt für den Referrer vor.
          if (referrer.email) {
            const newCustomerFullname = [body.firstname, body.lastname]
              .filter(Boolean)
              .join(" ");
            referrerEmailBundle = buildReferrerEmail({
              refFirst: referrer.firstname ?? "",
              refLast: referrer.lastname ?? "",
              refEmail: referrer.email,
              myReferralCode: referrer.myReferralCode,
              newCount: newReferralCount,
              discountRate: referrerDiscount,
              referrerPrice: referrer.price,
              newCustomerFullname:
                newCustomerFullname.length > 0
                  ? newCustomerFullname
                  : undefined,
            });
          }
        }
      }
    }

    // Neuen Kunden einen einzigartigen Empfehlungscode erstellen
    let myReferralCode = generateReferralCode();
    while (true) {
      const { data: existing } = await supabaseAdmin
        .from("customers")
        .select("myReferralCode")
        .eq("myReferralCode", myReferralCode)
        .single();
      if (!existing) break;
      myReferralCode = generateReferralCode();
    }

    // Neuer Kundenregistrierungs-Payload
    const customerData = {
      id: createId(),
      firstname: body.firstname,
      lastname: body.lastname,
      companyname: body.companyname,
      email: body.email,
      phone: body.phone,
      address: body.address,
      reference: body.reference || null, // verwendeter Referenzcode
      price: body.price, // Originalpreis
      myReferralCode,
      finalPrice: finalPriceForNewCustomer, // neuer Kunde normaler Preis
      discountRate: null, // Für neue Kunden gibt es keinen Rabatt.
      referralCount: 0,
      totalEarnings: 0,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Neuen Kunden speichern
    const { data: customer, error } = await supabaseAdmin
      .from("customers")
      .insert([customerData])
      .select()
      .single();

    if (error) {
      console.error("Customer insert error:", error);

      // E-Mail-Fehler bei der eindeutigen Einschränkung mit spezieller Nachricht
      if (
        error.message &&
        error.message.includes(
          'duplicate key value violates unique constraint "customers_email_key"'
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This email address is already registered. Each customer must have a unique email address.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    //  Protokolliere den -Vorgang
    if (referrerCode && referrerDiscount > 0) {
      await supabaseAdmin.from("referral_transactions").insert([
        {
          referrerCode,
          newCustomerId: customer.id,
          discountRate: referrerDiscount,
          originalPrice: body.price, // Preis für neuen Kunden
          finalPrice: body.price, // neuer Kunde hat normal bezahlt
          referralLevel: Math.ceil(referrerDiscount / 3),
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // Antwort: Wir geben auch die E-Mail-Parameter zurück, die an den Referrer gesendet werden.
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
      // Falls die Referrer-E-Mail-Parameter vorbereitet wurden, können Sie diese clientseitig mit EmailJS senden:

      referrerEmail: referrerEmailBundle
        ? {
            emailContent: referrerEmailBundle.emailContent,
            emailParams: referrerEmailBundle.emailParams,
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
