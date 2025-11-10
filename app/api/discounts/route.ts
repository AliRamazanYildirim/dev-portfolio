import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import CustomerModel from "@/models/Customer";

export async function GET(request: NextRequest) {
  try {
    await connectToMongo();

    const status = request.nextUrl.searchParams.get("status");
    const filter: Record<string, unknown> = {};

    if (status && ["pending", "sent"].includes(status)) {
      filter.invoiceStatus = status;
    }

    const transactions = await ReferralTransactionModel.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const customerIds = transactions
      .map((tx) => tx.newCustomerId)
      .filter((id): id is string => Boolean(id));

    const uniqueCustomerIds = Array.from(new Set(customerIds));

    const customers = await CustomerModel.find({ _id: { $in: uniqueCustomerIds } })
      .lean()
      .exec();

    const customerMap = new Map(
      customers.map((customer) => [String(customer._id), customer])
    );

    const referrerCodes = Array.from(
      new Set(
        transactions
          .map((tx) => tx.referrerCode)
          .filter((code): code is string => Boolean(code))
      )
    );

    const referrers = await CustomerModel.find({
      myReferralCode: { $in: referrerCodes },
    })
      .lean()
      .exec();

    const referrerMap = new Map(
      referrers.map((referrer) => [referrer.myReferralCode, referrer])
    );

    const toIsoString = (value: unknown): string | null => {
      if (!value) return null;
      if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value.toISOString();
      }
      const parsed = new Date(value as string);
      return isNaN(parsed.getTime()) ? null : parsed.toISOString();
    };

    const safeNumber = (value: unknown): number | null => {
      if (typeof value === "number" && !Number.isNaN(value)) return value;
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) return parsed;
      }
      return null;
    };

    const mapped = transactions.map((tx) => {
      const normalizedStatus = tx.invoiceStatus === "sent" ? "sent" : "pending";
      const customer = customerMap.get(String(tx.newCustomerId));
      const referrer = referrerMap.get(tx.referrerCode);
      const discountRate = safeNumber(tx.discountRate) ?? 0;
      let originalPrice = safeNumber(tx.originalPrice);
      let finalPrice = safeNumber(tx.finalPrice);

      if (originalPrice === null && finalPrice !== null) {
        originalPrice = discountRate > 0 ? finalPrice / (1 - discountRate / 100) : finalPrice;
      }

      if (finalPrice === null && originalPrice !== null) {
        finalPrice = discountRate > 0 ? originalPrice * (1 - discountRate / 100) : originalPrice;
      }

      if (originalPrice === null) originalPrice = 0;
      if (finalPrice === null) finalPrice = originalPrice;

      if (discountRate > 0 && originalPrice <= finalPrice && finalPrice > 0) {
        const derivedOriginal = finalPrice / (1 - discountRate / 100);
        if (Number.isFinite(derivedOriginal)) {
          originalPrice = derivedOriginal;
        }
      }

      const discountAmount = Math.max(originalPrice - finalPrice, 0);
      const invoiceNumber = tx.invoiceNumber ?? `INV-${String(tx._id).slice(-8).toUpperCase()}`;
      const candidateUpdatedAt = (tx as { updatedAt?: Date | string }).updatedAt;
      const fallbackSentAt =
        normalizedStatus === "sent"
          ? tx.invoiceSentAt ?? candidateUpdatedAt ?? tx.createdAt
          : null;
      const createdAt = toIsoString(tx.createdAt) ?? new Date().toISOString();
      const invoiceSentAt = toIsoString(fallbackSentAt);

      return {
        id: String(tx._id),
        customerId: tx.newCustomerId,
        referrerCode: tx.referrerCode,
        discountRate,
        originalPrice,
        finalPrice,
        discountAmount,
        referralLevel: tx.referralLevel,
        invoiceStatus: normalizedStatus,
        invoiceNumber,
        invoiceSentAt,
        createdAt,
        referrer: referrer
          ? {
            id: String(referrer._id),
            firstname: referrer.firstname ?? "",
            lastname: referrer.lastname ?? "",
            email: referrer.email ?? "",
            companyname: referrer.companyname ?? "",
            referralCode: referrer.myReferralCode ?? tx.referrerCode,
          }
          : null,
        customer: customer
          ? {
            id: String(customer._id),
            firstname: customer.firstname,
            lastname: customer.lastname,
            email: customer.email,
            companyname: customer.companyname,
          }
          : null,
      };
    });

    const pending = mapped.filter((item) => item.invoiceStatus === "pending");
    const sent = mapped.filter((item) => item.invoiceStatus === "sent");

    return NextResponse.json({
      success: true,
      data: {
        pending,
        sent,
      },
    });
  } catch (error) {
    console.error("Failed to load discounts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load referral discounts",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, invoiceStatus, invoiceNumber, invoiceSentAt } = await request.json();
    console.log("[PATCH /api/discounts] Received body:", { id, invoiceStatus, invoiceNumber, invoiceSentAt });

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Discount transaction id is required" },
        { status: 400 }
      );
    }

    if (invoiceStatus && !["pending", "sent"].includes(invoiceStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid discount status" },
        { status: 400 }
      );
    }

    await connectToMongo();

    const update: Record<string, unknown> = {};
    if (typeof invoiceStatus === "string") {
      update.invoiceStatus = invoiceStatus;
    }
    console.log("[PATCH /api/discounts] Update object after status:", update);

    if (invoiceNumber !== undefined) {
      update.invoiceNumber = invoiceNumber || null;
    }

    if (invoiceSentAt !== undefined) {
      if (invoiceSentAt) {
        const parsedDate = new Date(invoiceSentAt);
        if (Number.isNaN(parsedDate.getTime())) {
          return NextResponse.json(
            { success: false, error: "Invalid invoiceSentAt value" },
            { status: 400 }
          );
        }
        update.invoiceSentAt = parsedDate;
      } else {
        update.invoiceSentAt = null;
      }
    } else if (invoiceStatus === "sent") {
      update.invoiceSentAt = new Date();
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { success: false, error: "No update fields provided" },
        { status: 400 }
      );
    }
    console.log("[PATCH /api/discounts] Final update to save:", update);

    const updated = await ReferralTransactionModel.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Discount transaction not found" },
        { status: 404 }
      );
    }

    console.log("[PATCH /api/discounts] Successfully updated:", { id: String(updated._id), invoiceStatus: updated.invoiceStatus });

    return NextResponse.json({
      success: true,
      data: {
        id: String(updated._id),
        invoiceStatus: updated.invoiceStatus,
        invoiceNumber: updated.invoiceNumber ?? null,
        invoiceSentAt: updated.invoiceSentAt
          ? new Date(updated.invoiceSentAt).toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error("Failed to update discount status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update discount status" },
      { status: 500 }
    );
  }
}
