/**
 * Referral Send Email API – Types & Interfaces
 */

export interface SendReferralEmailInput {
    customerId: string;
    customerEmail?: string;
}

export interface SendReferralEmailResult {
    referralCode: string;
    customerName: string;
    customerEmail: string;
    sent: boolean;
}
