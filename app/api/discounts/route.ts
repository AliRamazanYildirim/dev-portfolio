import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import ReferralTransactionModel from "@/models/ReferralTransaction";
import CustomerModel from "@/models/Customer";
import { calcDiscountedPrice } from "@/app/api/admin/customers/lib/referral";

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

    // Determine display-only bonus transactions per referrer: for each referrer
    // take the newest `bonusCount = max(0, referralCount - STAGE_COUNT)` transactions
    // and treat them as bonus for canonical calculation (level + 1).
    const STAGE_COUNT = 3;
    const groupedByRef = new Map<string, any[]>();
    transactions.forEach((t) => {
      const code = t.referrerCode || "";
      const arr = groupedByRef.get(code) ?? [];
      arr.push(t);
      groupedByRef.set(code, arr);
    });

    // Compute per-transaction bonus level increments for display-only bonuses.
    // For each referrer, select the newest `bonusCount = max(0, referralCount - STAGE_COUNT)`
    // transactions (these are the bonus candidates). Assign incremental bonus steps
    // in chronological order (oldest selected = +1, next = +2, ...).
    const bonusLevelById = new Map<string, number>();
    groupedByRef.forEach((arr, code) => {
      const ref = referrerMap.get(code);
      const refCount = typeof (ref as any)?.referralCount === "number" ? (ref as any).referralCount : 0;
      const bonusCount = Math.max(0, refCount - STAGE_COUNT);
      if (bonusCount <= 0) return;
      // sort ascending (oldest -> newest) so we can assign increments chronologically
      const sortedAsc = [...arr].sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return ta - tb;
      });
      // pick the last `bonusCount` items (the newest ones) but keep chronological order
      const selected = sortedAsc.slice(-bonusCount);
      for (let i = 0; i < selected.length; i++) {
        const tx = selected[i];
        const rawLevel = typeof tx.referralLevel === "number" ? tx.referralLevel : Number(tx.referralLevel) || 0;
        const increment = i + 1; // oldest selected -> +1
        // Clamp computed bonus level to not exceed the referrer's referralCount
        const computed = Math.min(rawLevel + increment, refCount);
        bonusLevelById.set(String(tx._id), computed);
      }
    });
    const displayBonusIdSet = new Set<string>(Array.from(bonusLevelById.keys()));

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

      // Use the stored original/final prices from the transaction when available.
      // If we have the referrer's base price, compute canonical values using
      // the iterative `calcDiscountedPrice`. For bonus transactions, apply
      // one extra 3% step (i.e. level + 1) so the displayed Discount Amount
      // reflects the extra bonus step.
      let discountAmount = Math.max(originalPrice - finalPrice, 0);
      if (referrer && typeof (referrer as any).price === "number") {
        const refPrice = Number((referrer as any).price);
        const rawLevel = typeof tx.referralLevel === "number" ? tx.referralLevel : Number(tx.referralLevel) || 0;
        // Decide whether this transaction should be treated as a bonus step
        // for canonical calculation. This can come from the DB `isBonus` flag
        // or from the server-side display-only bonus set we computed above.
        const isDisplayBonus = (tx as any).isBonus || displayBonusIdSet.has(String(tx._id));
        // Determine canonical level: prefer explicit DB level, otherwise use
        // the precomputed display-only bonus level when present.
        let level = rawLevel;
        if (bonusLevelById.has(String(tx._id))) {
          level = bonusLevelById.get(String(tx._id)) as number;
        } else if (isDisplayBonus) {
          // fallback: if flagged as a bonus but we don't have a computed increment,
          // treat as one extra step (defensive).
          if (rawLevel <= STAGE_COUNT) {
            level = rawLevel + 1;
          }
        }
        const prevPrice = calcDiscountedPrice(refPrice, Math.max(0, level - 1));
        const nextPrice = calcDiscountedPrice(refPrice, level);
        if (Number.isFinite(prevPrice) && Number.isFinite(nextPrice)) {
          originalPrice = prevPrice;
          finalPrice = nextPrice;
          discountAmount = Math.max(Math.round((prevPrice - nextPrice) * 100) / 100, 0);
        }
      } else if ((tx as any).isBonus || displayBonusIdSet.has(String(tx._id))) {
        // Fallback: referrer has no base `price` field available (or it's missing).
        // Use the stored transaction finalPrice as the previous final and apply
        // one extra 3% step so the UI shows the iterative bonus amount instead
        // of defaulting to the existing 9% value.
        const txFinal = safeNumber(tx.finalPrice);
        if (txFinal !== null) {
          const rawLevel = typeof tx.referralLevel === "number" ? tx.referralLevel : Number(tx.referralLevel) || 0;
          const computedLevel = bonusLevelById.get(String(tx._id)) ?? (rawLevel + 1);
          const increment = Math.max(0, computedLevel - rawLevel);
          const next = increment > 0 ? calcDiscountedPrice(txFinal, increment) : txFinal;
          originalPrice = txFinal;
          finalPrice = next;
          discountAmount = Math.max(Math.round((txFinal - next) * 100) / 100, 0);
        }
      }
      const invoiceNumber = tx.invoiceNumber ?? `INV-${String(tx._id).slice(-8).toUpperCase()}`;
      const candidateUpdatedAt = (tx as { updatedAt?: Date | string }).updatedAt;
      const fallbackSentAt =
        normalizedStatus === "sent"
          ? tx.invoiceSentAt ?? candidateUpdatedAt ?? tx.createdAt
          : null;
      const createdAt = toIsoString(tx.createdAt) ?? new Date().toISOString();
      const invoiceSentAt = toIsoString(fallbackSentAt);

      const displayReferralLevel = bonusLevelById.get(String(tx._id)) ?? tx.referralLevel;

      return {
        id: String(tx._id),
        customerId: tx.newCustomerId,
        referrerCode: tx.referrerCode,
        discountRate,
        originalPrice,
        finalPrice,
        discountAmount,
        referralLevel: displayReferralLevel,
        discountStatus: normalizedStatus,
        discountNumber: invoiceNumber,
        discountSentAt: invoiceSentAt,
        emailSent: tx.emailSent ?? false,
        isBonus: (tx as { isBonus?: boolean }).isBonus ?? false,
        createdAt,
        referrer: referrer
          ? {
            id: String(referrer._id),
            firstname: referrer.firstname ?? "",
            lastname: referrer.lastname ?? "",
            email: referrer.email ?? "",
            companyname: referrer.companyname ?? "",
            referralCode: referrer.myReferralCode ?? tx.referrerCode,
            referralCount: typeof referrer.referralCount === "number" ? referrer.referralCount : 0,
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

    const pending = mapped.filter((item) => item.discountStatus === "pending");
    const sent = mapped.filter((item) => item.discountStatus === "sent");

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
    const { id, discountStatus, discountNumber, discountSentAt } = await request.json();
    console.log("[PATCH /api/discounts] Received body:", { id, discountStatus, discountNumber, discountSentAt });

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Discount transaction id is required" },
        { status: 400 }
      );
    }

    if (discountStatus && !["pending", "sent"].includes(discountStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid discount status" },
        { status: 400 }
      );
    }

    await connectToMongo();

    // Map incoming discount-* fields to the DB fields (which still use invoice-*)
    const update: Record<string, unknown> = {};
    if (typeof discountStatus === "string") {
      update.invoiceStatus = discountStatus;
    }
    console.log("[PATCH /api/discounts] Update object after status:", update);

    if (discountNumber !== undefined) {
      update.invoiceNumber = discountNumber || null;
    }

    if (discountSentAt !== undefined) {
      if (discountSentAt) {
        const parsedDate = new Date(discountSentAt);
        if (Number.isNaN(parsedDate.getTime())) {
          return NextResponse.json(
            { success: false, error: "Invalid discountSentAt value" },
            { status: 400 }
          );
        }
        update.invoiceSentAt = parsedDate;
      } else {
        update.invoiceSentAt = null;
      }
    } else if (discountStatus === "sent") {
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

    console.log("[PATCH /api/discounts] Successfully updated:", { id: String(updated._id), discountStatus: updated.invoiceStatus });

    return NextResponse.json({
      success: true,
      data: {
        id: String(updated._id),
        discountStatus: updated.invoiceStatus,
        discountNumber: updated.invoiceNumber ?? null,
        discountSentAt: updated.invoiceSentAt
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

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Discount transaction id is required" },
        { status: 400 }
      );
    }

    await connectToMongo();

    const deleted = await ReferralTransactionModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Discount transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: String(deleted._id),
      },
    });
  } catch (error) {
    console.error("Failed to delete discount record:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete discount record" },
      { status: 500 }
    );
  }
}
