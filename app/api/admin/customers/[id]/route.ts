import { NextResponse } from "next/server";
import CustomerModel from "@/models/Customer";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import { connectToMongo } from "@/lib/mongodb";
import { getDiscountsEnabled } from "@/lib/discountSettings";

// GET: Einzelnen Kunden abrufen
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectToMongo();
  const data = await CustomerModel.findById(id).lean().exec();

  if (!data) {
    return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data });
}

// PUT: Kunden aktualisieren
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToMongo();
    const discountsEnabled = await getDiscountsEnabled();
    const body = await req.json();

    // Abrufen der aktuellen Kundeninformationen
    const existingCustomer = await CustomerModel.findById(id).exec();

    if (!existingCustomer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    // Wenn ein Referenzcode hinzugefügt wird, fahre mit dem Vorgang fort - BELOHNE DEN EMPFEHLER
    let referrerDiscount = 0;
    let referrerCode = null;

    if (discountsEnabled && body.reference && body.price && !existingCustomer.reference) {
      // Wenn diesem Kunden zum ersten Mal ein Referenzcode hinzugefügt wird
      const referrer = await CustomerModel.findOne({ myReferralCode: body.reference }).exec();

      if (referrer && referrer.price && referrer.myReferralCode) {
        referrerCode = referrer.myReferralCode;

        const currentReferralCount = referrer.referralCount || 0;
        referrerDiscount = 3 + currentReferralCount * 3;
        referrerDiscount = Math.min(referrerDiscount, 15);

        const referrerFinalPrice = referrer.price - (referrer.price * referrerDiscount) / 100;

        await CustomerModel.findByIdAndUpdate(referrer._id, {
          referralCount: currentReferralCount + 1,
          discountRate: referrerDiscount,
          finalPrice: referrerFinalPrice,
          updatedAt: new Date(),
        }).exec();

        await ReferralTransactionModel.create({
          referrerCode,
          newCustomerId: existingCustomer._id.toString(),
          discountRate: referrerDiscount,
          originalPrice: body.price,
          finalPrice: body.price,
          referralLevel: Math.ceil(referrerDiscount / 3),
          invoiceStatus: "pending",
          invoiceNumber: null,
          invoiceSentAt: null,
        });
      }
    }

    // Bereite die Aktualisierungsdaten vor - KEIN RABATT AUF AKTUALISIERTES
    const updateData = {
      ...body,
      finalPrice: body.price, // Der aktualisierte Kunde zahlt den normalen Preis.
      discountRate: existingCustomer.discountRate, // Den aktuellen Rabattprozentsatz beibehalten
      updatedAt: new Date(),
    };

    try {
      const result = await CustomerModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      return NextResponse.json({
        success: true,
        data: result,
        referralApplied: referrerDiscount > 0,
        referrerReward: referrerDiscount > 0 ? { rate: referrerDiscount, message: `Der empfehlende Kunde hat ${referrerDiscount}% Rabatt erhalten!` } : null,
      });
    } catch (err: any) {
      const msg = err?.message || String(err);
      // Handle Mongo duplicate key error to return a friendly message
      if (msg.includes("duplicate key") || msg.includes("E11000") || msg.includes("email_1")) {
        // Try to find who owns the conflicting email to show a name-aware message
        try {
          const conflictEmailMatch = msg.match(/\{\s*email:\s*"([^"]+)"\s*\}/);
          const conflictEmail = conflictEmailMatch ? conflictEmailMatch[1] : updateData.email;
          const owner = await CustomerModel.findOne({ email: conflictEmail }).lean().exec();
          if (owner) {
            return NextResponse.json({ success: false, error: `This email address is already registered to: ${owner.firstname} ${owner.lastname}` }, { status: 409 });
          }
        } catch (e) {
          // ignore lookup errors
        }
        return NextResponse.json({ success: false, error: "This email address is already registered." }, { status: 409 });
      }

      return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Kunden löschen
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    try {
      await connectToMongo();
      await CustomerModel.findByIdAndDelete(id).exec();
      return NextResponse.json({ success: true });
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
