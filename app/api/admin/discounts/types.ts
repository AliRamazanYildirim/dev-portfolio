/**
 * Admin Discounts – Domain-Typen.
 *
 * Zentralisiert alle Input/Output-Typen für die discount send-email
 * und reset-email Sub-Routen.
 */

export type { SendEmailResult } from "./service";
export type { ResetEmailResult } from "./service";

export interface SendDiscountEmailInput {
    transactionId: string;
    discountRate: number;
}

export interface ResetDiscountEmailInput {
    transactionId: string;
    sendCorrectionEmail?: boolean;
}
