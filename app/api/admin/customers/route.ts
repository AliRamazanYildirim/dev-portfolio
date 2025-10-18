import { NextResponse } from "next/server";
import CustomerModel from "@/models/Customer";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

// - sort=price.asc | price.desc | name.asc
// - from=YYYY-MM-DD (inclusive)
// - to=YYYY-MM-DD (inclusive)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortParam = searchParams.get("sort");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const q = searchParams.get("q");

    // Build a mongoose-compatible query (was previously using Prisma-style filters)
    const query: any = {};
    if (from && to) {
      const fromIso = from.length === 10 ? `${from}T00:00:00.000Z` : from;
      const toIso = to.length === 10 ? `${to}T23:59:59.999Z` : to;
      query.createdAt = { $gte: new Date(fromIso), $lte: new Date(toIso) };
    }

    if (q) {
      const qClean = q.replace(/%/g, "");
      const fields = [
        "firstname",
        "lastname",
        "companyname",
        "address",
        "reference",
        "myReferralCode",
      ];
      query.$or = fields.map((f) => ({ [f]: { $regex: qClean, $options: "i" } }));
    }

    // Build mongoose sort object from `sortParam` (e.g. price.asc)
    const sortObj: any = {};
    if (sortParam) {
      const [field, dir] = sortParam.split(".");
      const ascending = dir === "asc";
      if (field === "price") {
        sortObj.price = ascending ? 1 : -1;
      } else if (field === "name") {
        // sort firstname then lastname
        sortObj.firstname = ascending ? 1 : -1;
        sortObj.lastname = ascending ? 1 : -1;
      } else if (field === "created") {
        sortObj.createdAt = ascending ? 1 : -1;
      }
    }

    try {
      const cursor = CustomerModel.find(query);
      if (Object.keys(sortObj).length > 0) cursor.sort(sortObj);
      const raw = await cursor.lean().exec();
      // Ensure each returned document has a stable `id` string (derived from MongoDB _id)
      const data = Array.isArray(raw)
        ? raw.map((d: any) => ({ ...d, id: d._id ? String(d._id) : d.id }))
        : raw;
      return NextResponse.json({ success: true, data });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
    }
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
          <p style="margin:0;color:#334155;font-size:13px;">🌐 Portfolio: <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="https://dev-portfolio-eight-khaki.vercel.app">Website besuchen</a></p>
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

// Bereite Willkommens-E-Mail mit Vertrag für neuen Kunden vor
function buildWelcomeEmailHTML({
  firstName,
  lastName,
  language = "de",
}: {
  firstName: string;
  lastName: string;
  language?: string;
}) {
  const content = {
    de: {
      subject: `🎉 Willkommen bei Ali Ramazan Yildirim – Ihr Dienstleistungsvertrag`,
      greeting: `Hallo ${firstName}`,
      intro: `Herzlich willkommen! Ich freuen mich sehr, Sie als neuen Kunden begrüßen zu dürfen.`,
      contract: `Im Anhang dieser E-Mail finden Sie unseren Dienstleistungsvertrag in drei Sprachen (DE/EN/TR). Bitte lesen Sie diesen sorgfältig durch und bewahren Sie ihn für Ihre Unterlagen auf.`,
      nextSteps: `Nächste Schritte:`,
      nextStepsList: `
        <li>Vertrag durchlesen und bei Fragen melden</li>
        <li>Projektdetails werden in Kürze besprochen</li>
        <li>Bei Bedarf erhalten Sie weitere Informationen per E-Mail</li>
      `,
      contactTitle: `Bei Fragen erreichen Sie mich unter:`,
      signature: `Herzliche Grüße`,
      footer: `Ich freue mich auf die Zusammenarbeit mit Ihnen!`,
    },
    en: {
      subject: `🎉 Welcome to Ali Ramazan Yildirim – Your Service Agreement`,
      greeting: `Hello ${firstName}`,
      intro: `Welcome! We are delighted to have you as our new customer.`,
      contract: `Attached to this email you will find our service agreement in three languages (DE/EN/TR). Please review it carefully and keep it for your records.`,
      nextSteps: `Next Steps:`,
      nextStepsList: `
        <li>Review the contract and contact us if you have questions</li>
        <li>Project details will be discussed shortly</li>
        <li>You will receive further information via email if needed</li>
      `,
      contactTitle: `If you have any questions, please contact me at:`,
      signature: `Best regards`,
      footer: `I look forward to working with you!`,
    },
    tr: {
      subject: `🎉 Ali Ramazan Yildirim'e Hoş Geldiniz – Hizmet Sözleşmeniz`,
      greeting: `Merhaba ${firstName}`,
      intro: `Hoş geldiniz! Sizi yeni müşterimiz olarak görmekten mutluluk duyuyoruz.`,
      contract: `Bu e-postanın ekinde üç dilde (DE/EN/TR) hizmet sözleşmemizi bulacaksınız. Lütfen dikkatlice okuyunuz ve kayıtlarınız için saklayınız.`,
      nextSteps: `Sonraki Adımlar:`,
      nextStepsList: `
        <li>Sözleşmeyi okuyun ve sorularınız varsa bize ulaşın</li>
        <li>Proje detayları kısa süre içinde görüşülecektir</li>
        <li>Gerekirse e-posta ile daha fazla bilgi alacaksınız</li>
      `,
      contactTitle: `Sorularınız için bana ulaşabilirsiniz:`,
      signature: `Saygılarımla`,
      footer: `Sizinle çalışmayı dört gözle bekliyorum!`,
    },
  };

  const lang = content[language as keyof typeof content] || content.de;

  const html = `<!DOCTYPE html><html lang="${language}"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${lang.subject}</title></head>
  <body style="margin: 0; padding: 40px 20px; background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);overflow:hidden;border:1px solid rgba(148,163,184,0.2);">
      <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:40px 30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">📄 Dienstleistungsvertrag</h1>
        <p style="color:rgba(255,255,255,0.9);margin:12px 0 0;font-size:15px;font-weight:500;">Ali Ramazan Yildirim – Fullstack Developer</p>
      </div>
      <div style="padding:40px 30px;">
        <p style="color:#1e293b;font-size:17px;line-height:1.6;margin:0 0 14px 0;">${lang.greeting} 👋</p>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 10px 0;">${lang.intro}</p>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px 0;">${lang.contract}</p>
        
        <div style="background:linear-gradient(135deg,#eef2ff,#ede9fe);border:1px solid #c7d2fe;border-radius:14px;padding:26px 24px;margin-bottom:32px;">
          <h2 style="margin:0 0 14px 0;font-size:18px;color:#4f46e5;font-weight:700;">📌 ${lang.nextSteps}</h2>
          <ul style="margin:0 0 0 18px;padding:0;color:#312e81;line-height:1.8;font-size:14px;">${lang.nextStepsList}</ul>
        </div>

        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:24px 22px;text-align:center;margin-bottom:30px;">
          <p style="margin:0 0 12px 0;color:#334155;font-size:14px;font-weight:600;">${lang.contactTitle}</p>
          <p style="margin:0 0 6px 0;color:#334155;font-size:14px;">📧 <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a></p>
          <p style="margin:0 0 6px 0;color:#334155;font-size:14px;">📞 +49 151 67145187</p>
          <p style="margin:0 0 16px 0;color:#334155;font-size:14px;">🌐 <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="https://dev-portfolio-eight-khaki.vercel.app/">Website besuchen</a></p>
          <p style="margin:0;color:#6366f1;font-size:13px;font-weight:600;">${lang.footer}</p>
        </div>

        <div style="text-align:center;margin-bottom:10px;">
          <p style="color:#1e293b;font-weight:600;margin:0 0 4px 0;">${lang.signature}</p>
          <p style="color:#1e293b;font-weight:700;margin:0 0 4px 0;font-size:17px;">Ali Ramazan Yildirim</p>
          <p style="color:#6366f1;font-weight:600;margin:0;font-size:14px;">Fullstack Web Developer & UI/UX Designer</p>
        </div>
        <div style="border-top:1px solid #e2e8f0;padding-top:14px;text-align:center;">
          <p style="color:#64748b;font-size:11px;line-height:1.5;margin:0;">Diese E-Mail wurde automatisch generiert. Bei Fragen antworten Sie bitte direkt auf diese Nachricht.</p>
        </div>
      </div>
    </div>
  </body></html>`;

  return { html, subject: lang.subject };
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
      const referrer = await CustomerModel.findOne({ myReferralCode: body.reference }).exec();

      if (referrer && referrer.price) {
        referrerCode = referrer.myReferralCode || null;

        const currentReferralCount = referrer.referralCount || 0;
        const newReferralCount = currentReferralCount + 1;

        const previousPrice = calcDiscountedPrice(referrer.price, currentReferralCount);
        const referrerFinalPrice = calcDiscountedPrice(referrer.price, newReferralCount);
        const currentDiscountAmount = previousPrice - referrerFinalPrice;
        referrerDiscount = Math.min(newReferralCount * 3, 9);

        try {
          await CustomerModel.findByIdAndUpdate(referrer._id, {
            referralCount: newReferralCount,
            discountRate: referrerDiscount,
            finalPrice: referrerFinalPrice,
            updatedAt: new Date(),
          }).exec();

          if (referrer.email) {
            referrerEmailHTML = buildReferrerEmailHTML({
              refFirst: referrer.firstname ?? "",
              refLast: referrer.lastname ?? "",
              myReferralCode: referrer.myReferralCode ?? "",
              newCount: newReferralCount,
              discountRate: referrerDiscount,
              referrerPrice: referrer.price,
              referrerFinalPrice: referrerFinalPrice,
              currentDiscountAmount: currentDiscountAmount,
            });

            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
              try {
                const transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                });
                await transporter.verify();
                await transporter.sendMail({
                  from: `"Ali Ramazan Yildirim" <${process.env.EMAIL_USER}>`,
                  to: referrer.email,
                  subject: referrerEmailHTML.subject,
                  html: referrerEmailHTML.html,
                });
              } catch (mailErr) {
                console.error("Failed sending referrer notification email:", mailErr);
              }
            } else {
              console.warn("Email credentials not configured; skipping referrer notification email.");
            }
          }

          // Insert referral transaction (only if referrer's code exists)
          if (referrer.myReferralCode) {
            await ReferralTransactionModel.create({
              referrerCode: referrer.myReferralCode,
              newCustomerId: referrer._id.toString(),
              discountRate: referrerDiscount,
              originalPrice: body.price,
              finalPrice: body.price,
              referralLevel: Math.ceil(referrerDiscount / 3),
            });
          }
        } catch (updateErr) {
          console.error("Error updating referrer:", updateErr);
        }
      }
    }

    // Neuen Kunden einen einzigartigen Empfehlungscode erstellen
    let myReferralCode = generateReferralCode();
    while (true) {
      const existing = await CustomerModel.findOne({ myReferralCode }).exec();
      if (!existing) break;
      myReferralCode = generateReferralCode();
    }

    // Neuer Kundenregistrierungs-Payload
    const customerData: any = {
      firstname: body.firstname || "",
      lastname: body.lastname || "",
      companyname: body.companyname || "",
      email: body.email,
      phone: body.phone || "",
      address: body.address || "",
      city: body.city || null,
      postcode: body.postcode || null,
      reference: body.reference || null, // verwendeter Referenzcode
      price: body.price, // Originalpreis
      myReferralCode,
      finalPrice: finalPriceForNewCustomer, // neuer Kunde normaler Preis
      discountRate: null, // Für neue Kunden gibt es keinen Rabatt.
      referralCount: 0,
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
      updatedAt: new Date(),
    };

    // Neuen Kunden speichern
    try {
      const customer = await CustomerModel.create(customerData);

      // If referral transaction was inserted earlier referencing referrer.id, we should update newCustomerId now.
      if (referrerCode) {
        // Find the latest referral transaction for this referrerCode with null/placeholder newCustomerId and update it.
        // Simpler approach: create a referral transaction here instead of earlier; we'll create it now referencing customer.id
        await ReferralTransactionModel.create({
          referrerCode,
          newCustomerId: customer._id.toString(),
          discountRate: referrerDiscount,
          originalPrice: body.price,
          finalPrice: body.price,
          referralLevel: Math.ceil(referrerDiscount / 3),
        });
      }

      // Sende Willkommens-E-Mail mit Vertrag an neuen Kunden
      if (customer.email) {
        try {
          const welcomeEmail = buildWelcomeEmailHTML({
            firstName: customer.firstname || "",
            lastName: customer.lastname || "",
            language: body.language || "de",
          });

          if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            });

            await transporter.verify();

            // PDF-Pfad prüfen
            const pdfPath = path.join(process.cwd(), "public", "contracts", "IT_Service_Agreement_EN-DE-TR.pdf");
            const pdfExists = fs.existsSync(pdfPath);

            const mailOptions: any = {
              from: `"Ali Ramazan Yildirim" <${process.env.EMAIL_USER}>`,
              to: customer.email,
              subject: welcomeEmail.subject,
              html: welcomeEmail.html,
            };

            // PDF anhängen, falls vorhanden
            if (pdfExists) {
              mailOptions.attachments = [
                {
                  filename: "IT_Service_Agreement_EN-DE-TR.pdf",
                  path: pdfPath,
                  contentType: "application/pdf",
                },
              ];
            } else {
              console.warn("Contract PDF not found at:", pdfPath);
            }

            await transporter.sendMail(mailOptions);
            console.log("Welcome email sent to:", customer.email);
          } else {
            console.warn("Email credentials not configured; skipping welcome email.");
          }
        } catch (emailErr) {
          console.error("Failed sending welcome email:", emailErr);
          // E-Mail-Fehler soll Kundenanlage nicht blockieren
        }
      }

      //  Protokolliere den -Vorgang
      return NextResponse.json({ success: true, data: customer });
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes("duplicate key value") || msg.includes("unique constraint")) {
        return NextResponse.json({ success: false, error: "This email address is already registered. Each customer must have a unique email address." }, { status: 409 });
      }
      console.error("Customer insert error:", err);
      return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }

    // Die Antwort wurde bereits oben im Try-Block zurückgegeben.
  } catch (error: any) {
    console.error("POST customer error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
