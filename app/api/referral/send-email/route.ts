import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { customerId, customerEmail } = await request.json();

    if (!customerId || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "Customer ID and email are required" },
        { status: 400 }
      );
    }

    // Müşteriyi ve referans kodunu getir
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("id, firstname, lastname, myReferralCode, referralCount")
      .eq("id", customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    if (!customer.myReferralCode) {
      return NextResponse.json(
        { success: false, error: "Customer does not have a referral code" },
        { status: 404 }
      );
    }

    // E-Mail-Inhalt erstellen
    const currentCount = customer.referralCount || 0;
    const hasReachedMaximum = currentCount >= 3;
    
    const emailContent = `
Hallo ${customer.firstname} ${customer.lastname},

es freut mich riesig, dass Sie mir Ihr Vertrauen geschenkt haben – gemeinsam erschaffen wir digitale Erlebnisse, die Eindruck hinterlassen!

Sie haben den ersten Schritt schon gemacht – und jetzt können Sie noch mehr gewinnen!

Mit Ihrem persönlichen Empfehlungscode sichern Sie sich immer größere Rabatte, je mehr Menschen Sie in mein Netzwerk bringen:

👉 ${customer.myReferralCode}

✨ So funktioniert es:

• 1. Empfehlung → 3% Rabatt
• 2. Empfehlung → 6% Rabatt  
• 3. Empfehlung → 9% Rabatt (Maximum)

📈 Sie haben bereits ${currentCount} Empfehlungen gesammelt${hasReachedMaximum ? ' – GLÜCKWUNSCH! 🎉' : ' – das bedeutet, Ihr Vorteil wächst schon jetzt!'}

${hasReachedMaximum ? `
🏆 MAXIMUM ERREICHT!
Sie haben das Maximum von 3 Empfehlungen erreicht und sichern sich dauerhaft 9% Rabatt auf alle zukünftigen Projekte! Ihr Code bleibt weiterhin aktiv – teilen Sie ihn gerne weiter, um anderen zu helfen, auch wenn Sie bereits die maximale Ersparnis erreicht haben.
` : `
🚀 Ihre Vorteile in jeder Empfehlung:

• Sie sparen bei künftigen Projekten bis zu 15%
• Ihre Freunde & Kollegen erhalten professionelle Unterstützung bei Webprojekten
• Jeder Gewinn bringt Sie dem Maximum einen Schritt näher
`}

🌐 Meine Dienstleistungen:
• Professionelle Websites
• E-Commerce-Lösungen
• Mobile Anwendungen
• Maßgeschneiderte Webentwicklung

💡 Jetzt aktiv werden:
Teilen Sie Ihren Code noch heute mit Freunden, Geschäftspartnern oder Kollegen und verwandeln Sie jede Empfehlung in einen Vorteil!

📧 Kontakt: aliramazanyildirim@gmail.com
🌐 Portfolio: https://dev-portfolio-obhj.onrender.com

Vielen Dank für Ihr Vertrauen – gemeinsam machen wir Ihre digitale Vision Realität!

Herzliche Grüße
Ali Ramazan Yildirim
Fullstack Web Developer & UI/UX Designer

---
Diese E-Mail wurde automatisch generiert. Bei Fragen wenden Sie sich bitte an aliramazanyildirim@gmail.com
    `.trim();

    // Frontend-seitig E-Mail-Inhalt zurückgeben (EmailJS funktioniert client-seitig)
    return NextResponse.json({
      success: true,
      data: {
      referralCode: customer.myReferralCode,
      customerName: `${customer.firstname} ${customer.lastname}`,
      customerEmail: customerEmail,
      emailContent: emailContent,
      emailParams: {
        to_email: customerEmail,
        to_name: `${customer.firstname} ${customer.lastname}`,
        subject: `Willkommen!🎉 Ihr exklusiver Empfehlungscode: ${customer.myReferralCode} – Ali Ramazan Yildirim`,
        message: emailContent,
        from_name: "Ali Ramazan Yildirim",
        reply_to: "aliramazanyildirim@gmail.com",
      },
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
