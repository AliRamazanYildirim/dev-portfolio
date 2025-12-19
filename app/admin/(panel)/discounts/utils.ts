import {
    DiscountEntry,
    StageGroup,
    PaginationState,
    STAGE_COUNT,
    StageSlot,
    StageStatus,
    BonusEntry,
} from "./types";

export const currencyFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
});

export function formatDate(value: string | null) {
    if (!value) return "-";
    try {
        return new Date(value).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch (error) {
        return value;
    }
}

export function calculateTotalRecovered(entries: DiscountEntry[]) {
    return entries.reduce(
        (total, entry) =>
            total + (entry.discountAmount ?? Math.max(entry.originalPrice - entry.finalPrice, 0)),
        0
    );
}

export function computeStageGroups(allInvoices: DiscountEntry[]): StageGroup[] {
    if (allInvoices.length === 0) return [];

    const map = new Map<string, StageGroup>();

    allInvoices.forEach((entry) => {
        const code = entry.referrer?.referralCode || entry.referrerCode;
        if (!map.has(code)) {
            map.set(code, {
                referrerCode: code,
                referrer: entry.referrer,
                stages: Array.from({ length: STAGE_COUNT }, (_, index): StageSlot => ({
                    level: index + 1,
                    entry: null,
                    status: (index === 0 ? "upcoming" : "locked") as StageStatus,
                    amount: 0,
                    discountSentAt: null,
                })),
                bonuses: [],
                totalDiscount: 0,
                completedCount: 0,
                pendingCount: 0,
                bonusCount: 0,
            });
        }

        const group = map.get(code)!;
        const referralLevel = entry.referralLevel ?? 1;
        const amount = entry.discountAmount ?? Math.max(entry.originalPrice - entry.finalPrice, 0);

        // Check if this is a bonus entry (isBonus flag or referralLevel > 3)
        if (entry.isBonus || referralLevel > STAGE_COUNT) {
            const bonusEntry: BonusEntry = {
                id: entry.id,
                amount,
                discountSentAt: entry.discountSentAt,
                status: entry.discountStatus === "sent" ? "sent" : "pending",
                customer: entry.customer,
            };
            group.bonuses.push(bonusEntry);
        } else {
            // Regular stage (1, 2, or 3)
            const index = Math.min(Math.max(referralLevel, 1), STAGE_COUNT) - 1;
            group.stages[index] = {
                level: index + 1,
                entry,
                status: entry.discountStatus === "sent" ? "sent" : "pending",
                amount,
                discountSentAt: entry.discountSentAt,
            };
        }

        if (!group.referrer && entry.referrer) {
            group.referrer = entry.referrer;
        }
    });

    const groups = Array.from(map.values()).map((group) => {
        const stages = group.stages.map((slot, index): StageSlot => {
            if (slot.entry) {
                const normalizedStatus: StageStatus =
                    slot.entry.discountStatus === "sent" ? "sent" : "pending";
                return {
                    ...slot,
                    status: normalizedStatus,
                };
            }

            if (index === 0) {
                return { ...slot, status: "upcoming" };
            }

            return slot;
        });

        // Sort bonuses by date (newest first)
        const sortedBonuses = [...group.bonuses].sort((a, b) => {
            const dateA = a.discountSentAt ? new Date(a.discountSentAt).getTime() : 0;
            const dateB = b.discountSentAt ? new Date(b.discountSentAt).getTime() : 0;
            return dateB - dateA;
        });

        const stagesDiscount = stages.reduce(
            (sum, stage) => sum + (stage.entry ? stage.amount : 0),
            0
        );
        const bonusDiscount = sortedBonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
        const totalDiscount = stagesDiscount + bonusDiscount;

        const completedCount = stages.filter((stage) => stage.status === "sent").length;
        const pendingCount = stages.filter((stage) => stage.status === "pending").length;
        const bonusCount = sortedBonuses.length;

        return {
            ...group,
            stages,
            bonuses: sortedBonuses,
            totalDiscount,
            completedCount,
            pendingCount,
            bonusCount,
        };
    });

    return groups.sort((a, b) => {
        const aName = `${a.referrer?.firstname ?? ""} ${a.referrer?.lastname ?? ""}`.trim();
        const bName = `${b.referrer?.firstname ?? ""} ${b.referrer?.lastname ?? ""}`.trim();
        return aName.localeCompare(bName);
    });
}

export function buildPagination(
    totalItems: number,
    pageSize: number,
    currentPage: number,
    setPage: (page: number) => void
): PaginationState {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const changePage = (page: number) => {
        const next = Math.min(Math.max(page, 1), totalPages);
        setPage(next);
    };

    return {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        onPageChange: changePage,
        onNextPage: () => changePage(currentPage + 1),
        onPrevPage: () => changePage(currentPage - 1),
        getPageNumbers: () => Array.from({ length: totalPages }, (_, index) => index + 1),
        getCurrentRange: () => {
            if (totalItems === 0) {
                return { start: 0, end: 0, total: 0 };
            }
            const start = (currentPage - 1) * pageSize + 1;
            const end = Math.min(start + pageSize - 1, totalItems);
            return { start, end, total: totalItems };
        },
    };
}
