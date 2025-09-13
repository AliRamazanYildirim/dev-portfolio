import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createId } from "@paralleldrive/cuid2";
import nodemailer from "nodemailer";

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
      query = query.gte("createdAt", fromIso).lte("createdAt", toIso);
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
        query = query.order("createdAt", { ascending });
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

// Helfer: Bei jeder Empfehlung einen prozentualen Rabatt auf den aktuellen Preis gewähren (maximal 3 Empfehlungen)
function calcDiscountedPrice(originalPrice: number, referralCount: number) {
  if (referralCount === 0) return originalPrice;

  let currentPrice = originalPrice;

  // Wende für jeden Verweis einen gestaffelten prozentualen Rabatt auf den aktuellen Preis an (maximal 3 Verweise).
  for (let i = 1; i <= Math.min(referralCount, 3); i++) {
    const discountPercentage = i * 3; // 3%, 6%, 9%
    const discountAmount = currentPrice * (discountPercentage / 100);
    currentPrice = currentPrice - discountAmount;
  }

  return currentPrice;
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
function buildReferrerEmailHTML({
  refFirst,
  refLast,
  myReferralCode,
  newCount,
  discountRate,
  referrerPrice,
  referrerFinalPrice,
  currentDiscountAmount,
}: {
  refFirst: string;
  refLast: string;
  myReferralCode: string;
  newCount: number;
  discountRate: number;
  referrerPrice?: number;
  referrerFinalPrice?: number;
  currentDiscountAmount?: number;
}) {
  const hasReachedMaximum = newCount >= 3;
  const currentDiscount = currentDiscountAmount || 0;
  const totalSavings =
    referrerPrice && referrerFinalPrice
      ? (referrerPrice - referrerFinalPrice).toFixed(2)
      : "0.00";

  const transparentBlock = (() => {
    if (newCount === 1) {
      return `
        <li>Ursprünglicher Preis: €${referrerPrice?.toFixed(2)}</li>
        <li>1. Empfehlung → 3% Rabatt</li>
        <li>Berechnung: €${referrerPrice?.toFixed(2)} - (€${referrerPrice?.toFixed(
          2
        )} × 3%) = €${currentDiscount.toFixed(2)} Ersparnis</li>`;
    }
    if (newCount === 2) {
      const after1 = (referrerPrice! * 0.97).toFixed(2);
      return `
        <li>Ursprünglicher Preis: €${referrerPrice?.toFixed(2)}</li>
        <li>Nach 1. Empfehlung: €${after1}</li>
        <li>2. Empfehlung → 6% Rabatt auf aktuellen Preis</li>
        <li>Berechnung: €${after1} × 6% = €${currentDiscount.toFixed(
          2
        )} zusätzliche Ersparnis</li>`;
    }
    if (newCount === 3) {
      const after1 = (referrerPrice! * 0.97).toFixed(2);
      const after2 = (referrerPrice! * 0.97 * 0.94).toFixed(2);
      return `
        <li>Ursprünglicher Preis: €${referrerPrice?.toFixed(2)}</li>
        <li>Nach 1. Empfehlung: €${after1}</li>
        <li>Nach 2. Empfehlung: €${after2}</li>
        <li>3. Empfehlung → 9% Rabatt auf aktuellen Preis</li>
        <li>Berechnung: €${after2} × 9% = €${currentDiscount.toFixed(
          2
        )} zusätzliche Ersparnis</li>`;
    }
    return "";
  })();

  const remaining = hasReachedMaximum
    ? `🏆 <strong style="color:#065f46;">MAXIMUM ERREICHT!</strong><br>Sie haben das Maximum erreicht und sichern sich dauerhaft <strong>9% Rabatt</strong> auf alle zukünftigen Projekte.`
    : `✨ Noch <strong>${3 - newCount}</strong> ${3 - newCount === 1 ? "Empfehlung" : "Empfehlungen"} bis zum Maximum von 9%.`;

  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Referral Update</title></head>
  <body style="margin: 0; padding: 40px 20px; background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);overflow:hidden;border:1px solid rgba(148,163,184,0.2);">
      <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:38px 30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Neue Empfehlung verbucht</h1>
        <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;font-size:14px;font-weight:500;">Ihr Code wurde erneut genutzt</p>
      </div>
      <div style="padding:38px 30px;">
        <p style="color:#1e293b;font-size:16px;line-height:1.6;margin:0 0 18px 0;">Hallo <span style="color:#6366f1;font-weight:600;">${refFirst} ${refLast}</span> 🎉</p>
        <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px 0;">Großartig! Jemand hat Ihren Empfehlungscode <strong>${myReferralCode}</strong> genutzt. Dadurch haben Sie einen weiteren Rabatt erhalten.</p>
        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:22px 22px;margin:0 0 26px 0;">
          <h2 style="margin:0 0 14px 0;font-size:17px;color:#1e293b;font-weight:700;">📊 Aktueller Status</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#334155;line-height:1.6;font-size:14px;">
            <li>Empfehlungen gesamt: <strong>${newCount}</strong></li>
            <li>Aktueller Projektpreis: €${referrerFinalPrice?.toFixed(2) || referrerPrice?.toFixed(2) || "0.00"}</li>
            <li>Aktueller Rabatt-Satz: ${discountRate}%</li>
            <li>Aktuelle Ersparnis (diese Stufe): €${currentDiscount.toFixed(2)}</li>
            <li>Gesamtersparnis: €${totalSavings}</li>
          </ul>
        </div>
        <div style="background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border:1px solid #bbf7d0;border-radius:14px;padding:22px 22px;margin:0 0 26px 0;">
          <h2 style="margin:0 0 14px 0;font-size:17px;color:#065f46;font-weight:700;">🔍 Transparente Berechnung</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#065f46;line-height:1.6;font-size:13px;">${transparentBlock}</ul>
          <p style="margin:14px 0 0 0;color:#065f46;font-size:13px;line-height:1.5;">Jeder Rabatt bezieht sich immer auf den jeweils zuletzt reduzierten Preis – fair und nachvollziehbar.</p>
        </div>
        <div style="background:linear-gradient(135deg,#fff7ed,#fffbeb);border:1px solid #fed7aa;border-radius:14px;padding:22px 22px;margin:0 0 26px 0;">
          <h2 style="margin:0 0 14px 0;font-size:17px;color:#9a3412;font-weight:700;">💰 Rabattstaffel</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#9a3412;line-height:1.6;font-size:13px;">
            <li>1. Empfehlung → 3%</li>
            <li>2. Empfehlung → 6%</li>
            <li>3. Empfehlung → 9% (Maximum)</li>
          </ul>
          <p style="margin:14px 0 0 0;color:#9a3412;font-size:13px;line-height:1.5;">${remaining}</p>
        </div>
        <div style="background:linear-gradient(135deg,#eef2ff,#ede9fe);border:1px solid #c7d2fe;border-radius:14px;padding:22px 22px;margin:0 0 30px 0;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.5px;font-weight:600;color:#4f46e5;text-transform:uppercase;">Ihr Empfehlungscode</p>
          <div style="font-size:26px;font-weight:700;letter-spacing:3px;color:#312e81;font-family:monospace;">${myReferralCode}</div>
          <p style="margin:10px 0 0 0;font-size:11px;color:#6366f1;">Weiter teilen & Vorteile sichern</p>
        </div>
        <div style="text-align:center;margin-bottom:30px;">
          <p style="margin:0 0 10px 0;color:#1e293b;font-weight:600;">IBAN für Auszahlung</p>
          <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Senden Sie Ihre IBAN an <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a> – Auszahlung innerhalb von 7 Werktagen.</p>
        </div>
        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:18px 18px;text-align:center;margin-bottom:28px;">
          <p style="margin:0 0 6px 0;color:#334155;font-size:13px;">📧 Kontakt: <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a></p>
          <p style="margin:0;color:#334155;font-size:13px;">🌐 Portfolio: <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="https://dev-portfolio-obhj.onrender.com">Website besuchen</a></p>
        </div>
        <div style="text-align:center;margin-bottom:8px;">
          <p style="color:#1e293b;font-weight:600;margin:0 0 4px 0;">Herzliche Grüße</p>
          <p style="color:#1e293b;font-weight:700;margin:0 0 4px 0;font-size:16px;">Ali Ramazan Yildirim</p>
          <p style="color:#6366f1;font-weight:600;margin:0;font-size:13px;">Fullstack Web Developer & UI/UX Designer</p>
        </div>
        <div style="border-top:1px solid #e2e8f0;padding-top:12px;text-align:center;">
          <p style="color:#64748b;font-size:11px;line-height:1.5;margin:0;">Diese E-Mail wurde automatisch generiert. Bei Fragen antworten Sie bitte direkt auf diese Nachricht.</p>
        </div>
      </div>
    </div>
  </body></html>`;

  const subject = `🎉 Danke für Ihre Empfehlung! ${discountRate}% Rabatt erhalten - ${myReferralCode}`;
  return { html, subject };
}

// POST: Neuen Kunden hinzufügen
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Wenn er mit einem Referenzcode gekommen ist: Finde die Person, die ihn empfohlen hat, aktualisiere den Rabatt und bereite die E-Mail vor.
    let referrerCode: string | null = null;
    let referrerDiscount = 0;
    let referrerEmailHTML: { html: string; subject: string } | null = null;

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

        // Berechne den vorherigen Preis (den Preis vor diesem Referenzpunkt)
        const previousPrice = calcDiscountedPrice(
          referrer.price,
          currentReferralCount
        );

        // Neue Preisberechnung: Stufenweiser 3% Rabatt auf den reduzierten Preis
        const referrerFinalPrice = calcDiscountedPrice(
          referrer.price,
          newReferralCount
        );

        // Bei diesem Verweis erhaltene Rabattbetrag
        const currentDiscountAmount = previousPrice - referrerFinalPrice;

        // Der auf dieser Referenzebene angewandte Prozentsatz (3 %, 6 %, 9 % - maximal 3 Referenzen)
        referrerDiscount = Math.min(newReferralCount * 3, 9);

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
            referrerEmailHTML = buildReferrerEmailHTML({
              refFirst: referrer.firstname ?? "",
              refLast: referrer.lastname ?? "",
              myReferralCode: referrer.myReferralCode,
              newCount: newReferralCount,
              discountRate: referrerDiscount,
              referrerPrice: referrer.price,
              referrerFinalPrice: referrerFinalPrice,
              currentDiscountAmount: currentDiscountAmount,
            });
            // Versuche direkt per Nodemailer zu senden
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
              console.warn("Email credentials not configured; skipping referrer notification email.");
            } else {
              try {
                const transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                });
                await transporter.verify();
                const sendResult = await transporter.sendMail({
                  from: `"Ali Ramazan Yildirim" <${process.env.EMAIL_USER}>`,
                  to: referrer.email,
                  subject: referrerEmailHTML.subject,
                  html: referrerEmailHTML.html,
                });
                console.log("Referrer notification email sent", sendResult.messageId);
              } catch (mailErr) {
                console.error("Failed sending referrer notification email:", mailErr);
              }
            }
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
      referrerEmail: referrerEmailHTML
        ? {
            subject: referrerEmailHTML.subject,
            htmlSent: Boolean(referrerEmailHTML),
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
