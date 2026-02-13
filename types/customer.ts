/**
 * Shared Customer types used across the entire application.
 *
 * Single source of truth — previously duplicated in:
 *   - services/customerService.ts
 *   - app/admin/(panel)/customers/types/customer.ts
 *   - app/admin/(panel)/customers/statistics/types.ts
 */

export interface Customer {
    id: string;
    _id?: string;
    firstname: string;
    lastname: string;
    companyname: string;
    email: string;
    phone: string;
    address: string;
    projectStatus?: "gestart" | "in-vorbereitung" | "abgeschlossen";
    city?: string;
    postcode?: string;
    reference: string;
    price?: number | null;
    finalPrice?: number | null;
    discountRate?: number | null;
    myReferralCode?: string;
    referralCount?: number;
    totalEarnings?: number;
    createdAt?: string | null;
    created_at?: string | null;
}

export interface FetchCustomersOptions {
    sort?: string;
    from?: string;
    to?: string;
    q?: string;
}
