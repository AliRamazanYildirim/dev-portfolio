import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import CustomerModel from "@/models/Customer";

export async function POST(request: Request) {
  try {
    const { customerId, customerEmail } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Fetch the customer from MongoDB using Mongoose. Use findById because
    // the frontend may pass the Mongo `_id` value.
    const customer = await CustomerModel.findById(customerId).lean().exec();
    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    if (!customer.myReferralCode) {
      return NextResponse.json(
        { success: false, error: "Customer does not have a referral code" },
        { status: 404 }
      );
    }

    // Referral verilerini hazırla
    const currentCount = customer.referralCount || 0;
    const hasReachedMaximum = currentCount >= 3;
    const referrerPrice = customer.price || 0;
    const discountSection = hasReachedMaximum
      ? `🏆 <strong style="color:#065f46;">MAXIMUM ERREICHT!</strong><br>Sie haben das Maximum von 3 Empfehlungen erreicht und sichern sich dauerhaft <strong>9% Rabatt</strong> auf alle zukünftigen Projekte! Ihr Code bleibt weiterhin aktiv – teilen Sie ihn gerne weiter.`
      : `🚀 <strong>Ihre Vorteile in jeder Empfehlung:</strong><br><ul style="margin:12px 0 0 18px; padding:0; color:#334155; line-height:1.6;">
          <li>Sie sparen schrittweise bis zu insgesamt 18% auf künftige Projekte.</li>
          <li>Ihre Kontakte erhalten professionelle Unterstützung bei Webprojekten.</li>
          <li>Jede Empfehlung bringt Sie dem Maximum näher.</li>
        </ul>`;

    // Nodemailer yapılandırması. Eğer gerçek SMTP bilgileri yoksa Ethereal test
    // hesabına düşerek geliştirmede gönderimi denemeye izin ver.
    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      try {
        await transporter.verify();
      } catch (e) {
        throw new Error("Email configuration invalid: " + e);
      }
    } else {
      // Fallback: Ethereal test account (development)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      console.warn("EMAIL_USER/PASS not configured — using Ethereal test account for sending emails.");
    }

    const subject = `🎉 Ihr Empfehlungscode: ${customer.myReferralCode} – Ali Ramazan Yildirim`;

    const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Empfehlungscode</title></head>
    <body style="margin: 0; padding: 40px 20px; background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);overflow:hidden;border:1px solid rgba(148,163,184,0.2);">
      <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:40px 30px;text-align:center;position:relative;">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">Ihr persönlicher Empfehlungscode</h1>
        <p style="color:rgba(255,255,255,0.9);margin:12px 0 0;font-size:15px;font-weight:500;">Ali Ramazan Yildirim – Fullstack Developer</p>
      </div>
      <div style="padding:40px 30px;">
        <div style="text-align:center;margin-bottom:32px;">
          <p style="color:#1e293b;font-size:17px;line-height:1.6;margin:0 0 14px 0;">Hallo <span style="color:#6366f1;font-weight:600;">${customer.firstname
      } ${customer.lastname}</span> 👋</p>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 10px 0;">Vielen Dank für Ihr Vertrauen – gemeinsam erschaffen wir digitale Erlebnisse!</p>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:0;">Nutzen Sie jetzt Ihren exklusiven Code und steigern Sie Ihre Vorteile:</p>
        </div>
        <div style="text-align:center;margin:0 auto 30px auto;max-width:400px;background:linear-gradient(135deg,#eef2ff,#ede9fe);padding:22px 24px;border:1px solid #c7d2fe;border-radius:14px;">
          <p style="margin:0 0 10px 0;font-size:13px;letter-spacing:0.5px;font-weight:600;color:#4f46e5;text-transform:uppercase;">Ihr Empfehlungscode</p>
          <div style="font-size:30px;font-weight:700;letter-spacing:3px;color:#312e81;font-family:monospace;">${customer.myReferralCode
      }</div>
          <p style="margin:14px 0 0 0;font-size:12px;color:#6366f1;">Teilen Sie diesen Code mit Ihrem Netzwerk</p>
        </div>
        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:26px 24px;margin-bottom:32px;">
          <h2 style="margin:0 0 18px 0;font-size:18px;color:#1e293b;font-weight:700;display:flex;align-items:center;gap:8px;">📊 Aktueller Status</h2>
          <p style="margin:0 0 8px 0;color:#334155;line-height:1.6;">Projektpreis: <strong>€${referrerPrice.toFixed(
        2
      )}</strong></p>
          <p style="margin:0;color:#334155;line-height:1.6;">Empfehlungen gesammelt: <strong>${currentCount}</strong> ${hasReachedMaximum
        ? '<span style="color:#065f46;font-weight:600;">(Maximum erreicht 🎉)</span>'
        : ""
      }</p>
        </div>
        <div style="background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border:1px solid #bbf7d0;border-radius:14px;padding:26px 24px;margin-bottom:32px;">
          <h2 style="margin:0 0 14px 0;font-size:18px;color:#065f46;font-weight:700;display:flex;align-items:center;gap:8px;">💰 Rabattstaffel</h2>
          <ul style="margin:0 0 14px 18px;padding:0;color:#065f46;line-height:1.6;font-size:14px;">
            <li>1. Empfehlung → 3% Rabatt</li>
            <li>2. Empfehlung → 6% Rabatt</li>
            <li>3. Empfehlung → 9% Rabatt (Maximum)</li>
          </ul>
          <div style="color:#065f46;font-size:14px;line-height:1.6;">${discountSection}</div>
        </div>
        <div style="background:linear-gradient(135deg,#fff7ed,#fffbeb);border:1px solid #fed7aa;border-radius:14px;padding:26px 24px;margin-bottom:32px;">
          <h2 style="margin:0 0 14px 0;font-size:18px;color:#9a3412;font-weight:700;display:flex;align-items:center;">
            <span style="margin-right:8px;">👨🏻‍💻</span> Dienstleistungen
          </h2>
          <ul style="margin:0 0 0 18px;padding:0;color:#9a3412;line-height:1.6;font-size:14px;">
            <li>Professionelle Websites</li>
            <li>E-Commerce-Lösungen</li>
            <li>Mobile Anwendungen</li>
            <li>Maßgeschneiderte Webentwicklung</li>
          </ul>
        </div>
        <div style="text-align:center;margin-bottom:36px;">
          <p style="margin:0 0 10px 0;color:#1e293b;font-weight:600;">Jetzt aktiv werden 🚀</p>
          <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">Teilen Sie Ihren Code heute mit Freunden, Partnern oder Kollegen und verwandeln Sie jede Empfehlung in einen Vorteil!</p>
        </div>
        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:24px 22px;text-align:center;margin-bottom:30px;">
          <p style="margin:0 0 8px 0;color:#334155;font-size:14px;">📧 Kontakt: <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a></p>
          <p style="margin:0;color:#334155;font-size:14px;">🌐 Portfolio: <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="https://dev-portfolio-obhj.onrender.com">Website besuchen</a></p>
        </div>
        <div style="text-align:center;margin-bottom:10px;">
          <p style="color:#1e293b;font-weight:600;margin:0 0 4px 0;">Herzliche Grüße</p>
          <p style="color:#1e293b;font-weight:700;margin:0 0 4px 0;font-size:17px;">Ali Ramazan Yildirim</p>
          <p style="color:#6366f1;font-weight:600;margin:0;font-size:14px;">Fullstack Web Developer & UI/UX Designer</p>
        </div>
        <div style="border-top:1px solid #e2e8f0;padding-top:14px;text-align:center;">
          <p style="color:#64748b;font-size:11px;line-height:1.5;margin:0;">Diese E-Mail wurde automatisch generiert. Bei Fragen antworten Sie bitte direkt auf diese Nachricht.</p>
        </div>
      </div>
    </div>
    </body></html>`;

    const toAddress = customerEmail || customer.email;
    if (!toAddress) {
      return NextResponse.json({ success: false, error: "No recipient email provided" }, { status: 400 });
    }

    const fromAddress = process.env.EMAIL_USER || `"No-Reply" <no-reply@localhost>`;

    const result = await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      subject,
      html: html,
    });

    // If using Ethereal, attach a preview URL for debugging
    const previewUrl = nodemailer.getTestMessageUrl(result) || null;

    return NextResponse.json({
      success: true,
      data: {
        referralCode: customer.myReferralCode,
        customerName: `${customer.firstname} ${customer.lastname}`,
        customerEmail: toAddress,
        messageId: result.messageId,
        previewUrl,
      },
    });
  } catch (error: any) {
    console.error("Referral email preparation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
