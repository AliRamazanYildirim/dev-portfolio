export interface DiscountEntry {
    id: string;
    customerId: string;
    referrerCode: string;
    discountRate: number;
    originalPrice: number;
    finalPrice: number;
    discountAmount: number;
    referralLevel: number;
    discountStatus: "pending" | "sent";
    discountSentAt: string | null;
    emailSent: boolean;
    isBonus: boolean;
    createdAt: string;
    referrer: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        companyname: string;
        referralCode: string;
    } | null;
    customer: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        companyname: string;
    } | null;
}

export interface DiscountResponse {
    pending: DiscountEntry[];
    sent: DiscountEntry[];
}

export type StageStatus = "sent" | "pending" | "upcoming" | "locked";

export interface StageSlot {
    level: number;
    entry: DiscountEntry | null;
    status: StageStatus;
    amount: number;
    discountSentAt: string | null;
}

export interface BonusEntry {
    id: string;
    amount: number;
    discountSentAt: string | null;
    status: "sent" | "pending";
    customer: DiscountEntry["customer"];
}

export interface StageGroup {
    referrerCode: string;
    referrer: DiscountEntry["referrer"];
    stages: StageSlot[];
    bonuses: BonusEntry[];
    totalDiscount: number;
    completedCount: number;
    pendingCount: number;
    bonusCount: number;
}

export interface PaginationState {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onPageChange: (page: number) => void;
    onNextPage: () => void;
    onPrevPage: () => void;
    getPageNumbers: () => number[];
    getCurrentRange: () => { start: number; end: number; total: number };
}

export const STAGE_COUNT = 3;
export const RECORDS_PER_PAGE = 3;
export const STAGE_GROUPS_PER_PAGE = 2;
