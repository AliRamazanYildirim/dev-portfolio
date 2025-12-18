import { NextResponse } from "next/server";
import CustomerModel from "@/models/Customer";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import { connectToMongo } from "@/lib/mongodb";
import path from "path";
import fs from "fs";
import { getDiscountsEnabled } from "@/lib/discountSettings";
import { fetchCustomers } from "./lib/query";
import {
  calcDiscountedPrice,
  generateUniqueReferralCode,
} from "./lib/referral";
import {
  buildReferrerEmailHTML,
  buildWelcomeEmailHTML,
} from "./lib/email-templates";
import { sendAdminEmail } from "./lib/mailer";

// - sort=price.asc | price.desc | name.asc
// - from=YYYY-MM-DD (inclusive)
// - to=YYYY-MM-DD (inclusive)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await fetchCustomers({
      sort: searchParams.get("sort"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
      q: searchParams.get("q"),
    });
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
    await connectToMongo();
    const body = await req.json();
    const discountsEnabled = await getDiscountsEnabled();

    // Wenn er mit einem Referenzcode gekommen ist: Finde die Person, die ihn empfohlen hat, aktualisiere den Rabatt und bereite die E-Mail vor.
    let referrerCode: string | null = null;
    let referrerDiscount = 0;
    let referrerOriginalPrice: number | null = null;
    let referrerDiscountedPrice: number | null = null;

    // NEUKUNDE ZAHLT DEN NORMALEN PREIS
    const finalPriceForNewCustomer = body.price || 0;

    if (discountsEnabled && body.reference && body.price) {
      const referrer = await CustomerModel.findOne({ myReferralCode: body.reference }).exec();

      if (referrer && referrer.price) {
        referrerCode = referrer.myReferralCode || null;

        const currentReferralCount = referrer.referralCount || 0;
        const newReferralCount = currentReferralCount + 1;

        const previousPrice = calcDiscountedPrice(referrer.price, currentReferralCount);
        const referrerFinalPrice = calcDiscountedPrice(referrer.price, newReferralCount);
        const currentDiscountAmount = previousPrice - referrerFinalPrice;
        referrerOriginalPrice = previousPrice;
        referrerDiscountedPrice = referrerFinalPrice;
        referrerDiscount = Math.min(newReferralCount * 3, 9);

        try {
          await CustomerModel.findByIdAndUpdate(referrer._id, {
            referralCount: newReferralCount,
            discountRate: referrerDiscount,
            finalPrice: referrerFinalPrice,
            updatedAt: new Date(),
          }).exec();

          if (referrer.email) {
            try {
              const { html, subject } = buildReferrerEmailHTML({
                refFirst: referrer.firstname ?? "",
                refLast: referrer.lastname ?? "",
                myReferralCode: referrer.myReferralCode ?? "",
                newCount: newReferralCount,
                discountRate: referrerDiscount,
                referrerPrice: referrer.price,
                referrerFinalPrice,
                currentDiscountAmount,
              });

              await sendAdminEmail({
                to: referrer.email,
                subject,
                html,
              });
            } catch (mailErr) {
              console.error("Failed sending referrer notification email:", mailErr);
            }
          }
        } catch (updateErr) {
          console.error("Error updating referrer:", updateErr);
        }
      }
    }

    const myReferralCode = await generateUniqueReferralCode();

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
          originalPrice: referrerOriginalPrice ?? body.price,
          finalPrice: referrerDiscountedPrice ?? body.price,
          referralLevel: Math.ceil(referrerDiscount / 3),
          invoiceStatus: "pending",
          invoiceNumber: null,
          invoiceSentAt: null,
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
          const pdfPath = path.join(
            process.cwd(),
            "public",
            "contracts",
            "IT_Service_Agreement_EN-DE-TR.pdf"
          );
          const pdfExists = fs.existsSync(pdfPath);

          if (!pdfExists) {
            console.warn("Contract PDF not found at:", pdfPath);
          }

          await sendAdminEmail({
            to: customer.email,
            subject: welcomeEmail.subject,
            html: welcomeEmail.html,
            attachments: pdfExists
              ? [
                {
                  filename: "IT_Service_Agreement_EN-DE-TR.pdf",
                  path: pdfPath,
                  contentType: "application/pdf",
                },
              ]
              : undefined,
          });
          console.log("Welcome email sent to:", customer.email);
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
