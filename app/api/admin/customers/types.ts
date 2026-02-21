/**
 * Admin Customers API – Types & Interfaces
 *
 * Eigene Request-Typen + Re-Exports der Shared DTOs aus lib/dto.ts
 * Externe Consumer MÜSSEN über dieses Root-Modul importieren (ARCHITECTURE.md).
 */

/* ---------- Re-Exports aus lib/ (Public API) ---------- */

export {
    toCustomerReadDto,
    type CustomerReadDto,
    type CustomerListItemDto,
} from "./lib/dto";

export {
    calcDiscountedPrice,
    calcTotalEarnings,
} from "./lib/referral";

export {
    buildReferrerEmailHTML,
    buildBonusEmailHTML,
    buildCorrectionEmailHTML,
} from "./lib/email-templates";

/* ---------- Request DTOs ---------- */

export interface CreateCustomerRequest {
    firstname?: string;
    lastname?: string;
    companyname?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string | null;
    postcode?: string | null;
    reference?: string | null;
    price: number;
    language?: string;
    createdAt?: string;
}

export interface CustomerQueryParams {
    sort?: string | null;
    from?: string | null;
    to?: string | null;
    q?: string | null;
}

export interface UpdateCustomerRequest {
    firstname?: string;
    lastname?: string;
    companyname?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string | null;
    postcode?: string | null;
    reference?: string | null;
    price?: number;
    referralCount?: number;
    projectStatus?: "gestart" | "in-vorbereitung" | "abgeschlossen";
}
