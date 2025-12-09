import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { findCustomerById } from "./lib/customer";
import { buildReferralEmailTemplate } from "./lib/template";
import { sendReferralEmail } from "./lib/mailer";

export async function POST(request: Request) {
  try {
    const { customerId, customerEmail } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID is required" },
        { status: 400 }
      );
    }

    await connectToMongo();
    const customer = await findCustomerById(customerId);
    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    if (!customer.myReferralCode) {
      return NextResponse.json(
        { success: false, error: "Customer does not have a referral code" },
        { status: 404 }
      );
    }

    const { subject, html } = buildReferralEmailTemplate({
      firstName: customer.firstname ?? "",
      lastName: customer.lastname ?? "",
      referralCode: customer.myReferralCode,
      referralCount: customer.referralCount ?? 0,
      referrerPrice: customer.price ?? 0,
    });

    const toAddress = customerEmail || customer.email;
    if (!toAddress) {
      return NextResponse.json({ success: false, error: "No recipient email provided" }, { status: 400 });
    }

    const { messageId, previewUrl } = await sendReferralEmail({
      to: toAddress,
      subject,
      html,
    });

    return NextResponse.json({
      success: true,
      data: {
        referralCode: customer.myReferralCode,
        customerName: `${customer.firstname} ${customer.lastname}`,
        customerEmail: toAddress,
        messageId,
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
