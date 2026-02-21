import { connectToMongo } from "@/lib/mongodb";
import { customerRepository, referralRepository } from "@/lib/repositories";
import {
    calcDiscountedPrice,
    calcTotalEarnings,
} from "@/app/api/admin/customers/types";
import { toIsoString, toSafeNumber as safeNumber } from "@/lib/validation";
import type { DiscountGroups, DiscountStatus, PatchDiscountInput } from "./types";

export class DiscountsService {
    static async listDiscounts(status?: DiscountStatus): Promise<DiscountGroups> {
        await connectToMongo();

        const filter: Record<string, unknown> = {};
        if (status) {
            filter.invoiceStatus = status;
        }

        const transactions = await referralRepository.findMany({
            where: filter,
            orderBy: { createdAt: -1 },
        }) as any[];

        const customerIds = (transactions ?? [])
            .map((tx: any) => tx.newCustomerId)
            .filter((id: any): id is string => Boolean(id));

        const uniqueCustomerIds = Array.from(new Set(customerIds));

        const customers = await customerRepository.findByIds(uniqueCustomerIds) as any[];

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

        const referrers = await customerRepository.findMany({
            where: { myReferralCode: { $in: referrerCodes } },
        }) as any[];

        const referrerMap = new Map(
            referrers.map((referrer) => [referrer.myReferralCode, referrer])
        );

        const STAGE_COUNT = 3;
        const groupedByRef = new Map<string, any[]>();
        transactions.forEach((t) => {
            const code = t.referrerCode || "";
            const arr = groupedByRef.get(code) ?? [];
            arr.push(t);
            groupedByRef.set(code, arr);
        });

        const bonusLevelById = new Map<string, number>();
        groupedByRef.forEach((arr, code) => {
            const ref = referrerMap.get(code);
            const refCount =
                typeof (ref as any)?.referralCount === "number"
                    ? (ref as any).referralCount
                    : 0;
            const bonusCount = Math.max(0, refCount - STAGE_COUNT);
            if (bonusCount <= 0) return;

            const sortedAsc = [...arr].sort((a, b) => {
                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return ta - tb;
            });

            const selected = sortedAsc.slice(-bonusCount);
            for (let i = 0; i < selected.length; i++) {
                const tx = selected[i];
                const rawLevel =
                    typeof tx.referralLevel === "number"
                        ? tx.referralLevel
                        : Number(tx.referralLevel) || 0;
                const increment = i + 1;
                const computed = Math.min(rawLevel + increment, refCount);
                bonusLevelById.set(String(tx._id), computed);
            }
        });
        const displayBonusIdSet = new Set<string>(Array.from(bonusLevelById.keys()));

        const mapped = transactions.map((tx) => {
            const normalizedStatus: DiscountStatus =
                tx.invoiceStatus === "sent" ? "sent" : "pending";
            const customer = customerMap.get(String(tx.newCustomerId));
            const referrer = referrerMap.get(tx.referrerCode);
            const discountRate = safeNumber(tx.discountRate) ?? 0;
            let originalPrice = safeNumber(tx.originalPrice);
            let finalPrice = safeNumber(tx.finalPrice);

            if (originalPrice === null && finalPrice !== null) {
                originalPrice =
                    discountRate > 0 ? finalPrice / (1 - discountRate / 100) : finalPrice;
            }

            if (finalPrice === null && originalPrice !== null) {
                finalPrice =
                    discountRate > 0 ? originalPrice * (1 - discountRate / 100) : originalPrice;
            }

            if (originalPrice === null) originalPrice = 0;
            if (finalPrice === null) finalPrice = originalPrice;

            if (discountRate > 0 && originalPrice <= finalPrice && finalPrice > 0) {
                const derivedOriginal = finalPrice / (1 - discountRate / 100);
                if (Number.isFinite(derivedOriginal)) {
                    originalPrice = derivedOriginal;
                }
            }

            let discountAmount = Math.max(originalPrice - finalPrice, 0);
            if (referrer && typeof (referrer as any).price === "number") {
                const refPrice = Number((referrer as any).price);
                const rawLevel =
                    typeof tx.referralLevel === "number"
                        ? tx.referralLevel
                        : Number(tx.referralLevel) || 0;
                const isDisplayBonus =
                    (tx as any).isBonus || displayBonusIdSet.has(String(tx._id));

                let level = rawLevel;
                if (bonusLevelById.has(String(tx._id))) {
                    level = bonusLevelById.get(String(tx._id)) as number;
                } else if (isDisplayBonus && rawLevel <= STAGE_COUNT) {
                    level = rawLevel + 1;
                }

                const prevPrice = calcDiscountedPrice(refPrice, Math.max(0, level - 1));
                const nextPrice = calcDiscountedPrice(refPrice, level);
                if (Number.isFinite(prevPrice) && Number.isFinite(nextPrice)) {
                    originalPrice = prevPrice;
                    finalPrice = nextPrice;
                    discountAmount = Math.max(
                        Math.round((prevPrice - nextPrice) * 100) / 100,
                        0
                    );
                }
            } else if ((tx as any).isBonus || displayBonusIdSet.has(String(tx._id))) {
                const txFinal = safeNumber(tx.finalPrice);
                if (txFinal !== null) {
                    const rawLevel =
                        typeof tx.referralLevel === "number"
                            ? tx.referralLevel
                            : Number(tx.referralLevel) || 0;
                    const computedLevel = bonusLevelById.get(String(tx._id)) ?? rawLevel + 1;
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
                        referralCount:
                            typeof referrer.referralCount === "number"
                                ? referrer.referralCount
                                : 0,
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

        return { pending, sent };
    }

    static async updateDiscount(input: PatchDiscountInput) {
        await connectToMongo();

        const update: Record<string, unknown> = {};
        if (typeof input.discountStatus === "string") {
            update.invoiceStatus = input.discountStatus;
        }

        if (input.discountNumber !== undefined) {
            update.invoiceNumber = input.discountNumber || null;
        }

        if (input.discountSentAt !== undefined) {
            if (input.discountSentAt) {
                update.invoiceSentAt = new Date(input.discountSentAt);
            } else {
                update.invoiceSentAt = null;
            }
        } else if (input.discountStatus === "sent") {
            update.invoiceSentAt = new Date();
        }

        const updated = await referralRepository.update({
            where: { id: input.id },
            data: update,
        }) as any;

        if (!updated) {
            return null;
        }

        return {
            id: String(updated._id),
            discountStatus: updated.invoiceStatus,
            discountNumber: updated.invoiceNumber ?? null,
            discountSentAt: updated.invoiceSentAt
                ? new Date(updated.invoiceSentAt).toISOString()
                : null,
        };
    }

    static async deleteDiscount(id: string) {
        await connectToMongo();

        const deleted = await referralRepository.delete({ where: { id } }) as any;
        if (!deleted) {
            return null;
        }

        try {
            const code = deleted.referrerCode;
            if (code) {
                const remaining = await referralRepository.countDocuments({
                    referrerCode: code,
                });
                const referrer = await customerRepository.findUnique({
                    where: { myReferralCode: code },
                }) as any;
                if (referrer) {
                    const newCount = Math.max(0, remaining);
                    const newRate = Math.min(newCount * 3, 9);
                    const newFinal =
                        typeof referrer.price === "number"
                            ? calcDiscountedPrice(Number(referrer.price), newCount)
                            : referrer.finalPrice;
                    const totalEarnings = calcTotalEarnings(referrer.price, newCount);

                    await customerRepository.update({
                        where: { id: String(referrer._id ?? referrer.id) },
                        data: {
                            referralCount: newCount,
                            discountRate: newRate,
                            finalPrice: newFinal,
                            totalEarnings,
                            updatedAt: new Date(),
                        },
                    });
                }
            }
        } catch (err) {
            console.error("Failed to recompute referrer after tx delete:", err);
        }

        try {
            const usedCustomerId = deleted.newCustomerId;
            const usedCode = deleted.referrerCode;
            if (usedCustomerId && usedCode) {
                const usedCustomer = await customerRepository.findUnique({
                    where: { id: usedCustomerId },
                }) as any;
                if (usedCustomer && usedCustomer.reference === usedCode) {
                    await customerRepository.update({
                        where: { id: usedCustomerId },
                        data: { reference: null, updatedAt: new Date() } as any,
                    });
                }
            }
        } catch (err) {
            console.error("Failed to clear customer's used referral after tx delete:", err);
        }

        return { id: String(deleted._id) };
    }
}
