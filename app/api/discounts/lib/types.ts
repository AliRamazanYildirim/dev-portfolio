export type DiscountStatus = "pending" | "sent";

export interface DiscountReferrer {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    companyname: string;
    referralCode: string;
    referralCount: number;
}

export interface DiscountCustomer {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    companyname: string;
}

export interface DiscountItem {
    id: string;
    customerId: string;
    referrerCode: string;
    discountRate: number;
    originalPrice: number;
    finalPrice: number;
    discountAmount: number;
    referralLevel: number;
    discountStatus: DiscountStatus;
    discountNumber: string;
    discountSentAt: string | null;
    emailSent: boolean;
    isBonus: boolean;
    createdAt: string;
    referrer: DiscountReferrer | null;
    customer: DiscountCustomer | null;
}

export interface DiscountGroups {
    pending: DiscountItem[];
    sent: DiscountItem[];
}

export interface PatchDiscountInput {
    id: string;
    discountStatus?: DiscountStatus;
    discountNumber?: string | null;
    discountSentAt?: string | null;
}

export interface DeleteDiscountInput {
    id: string;
}
