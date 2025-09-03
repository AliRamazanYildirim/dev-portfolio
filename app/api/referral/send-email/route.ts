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
    const emailContent = `
Hallo ${customer.firstname} ${customer.lastname}!

Vielen Dank, dass Sie mich für Ihre Webentwicklungsprojekte gewählt haben!

🎉 Ihr persönlicher Empfehlungscode: ${customer.myReferralCode}

Mit diesem Code können Sie:
✨ 5% Startrabatt für neue Kunden bieten
💰 Zusätzliche 5% für jeden weiteren Empfohlenen (bis zu 50% maximal)
📈 Derzeit haben Sie bereits ${customer.referralCount || 0} Personen empfohlen

Teilen Sie diesen Code mit Freunden und Kollegen, die professionelle Webentwicklungsdienstleistungen benötigen!

🚀 Dienstleistungen:
• Professionelle Websites
• E-Commerce-Lösungen  
• Mobile Anwendungen
• Custom Web Development

📧 Kontakt: aliramazanyildirim@gmail.com
🌐 Portfolio: https://dev-portfolio-obhj.onrender.com

Vielen Dank für Ihr Vertrauen!
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
          subject: `Ihr Empfehlungscode: ${customer.myReferralCode} - Ali Ramazan Yildirim`,
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
