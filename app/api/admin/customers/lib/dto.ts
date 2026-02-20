/**
 * Customer Domain DTOs – Typ-sichere Read-/Write-Modelle.
 *
 * Eliminiert `unknown`/`as`-Cast-Ketten im gesamten Customer-Domain.
 * Jede Schicht arbeitet nur mit dem DTO, das sie braucht.
 */

/* ---------- Read DTOs ---------- */

export interface CustomerReadDto {
    id: string;
    _id?: string;
    firstname: string;
    lastname: string;
    companyname: string;
    email: string;
    phone: string;
    address: string;
    city?: string | null;
    postcode?: string | null;
    projectStatus?: "gestart" | "in-vorbereitung" | "abgeschlossen";
    reference?: string | null;
    price: number;
    finalPrice: number;
    discountRate?: number | null;
    myReferralCode?: string | null;
    referralCount: number;
    totalEarnings: number;
    createdAt: Date;
    updatedAt: Date;
}

/** Kompakte Ansicht für Listen (z. B. Admin-Tabelle) */
export interface CustomerListItemDto {
    id: string;
    firstname: string;
    lastname: string;
    companyname: string;
    email: string;
    price: number;
    finalPrice: number;
    referralCount: number;
    totalEarnings: number;
    createdAt: Date;
}

/* ---------- Write DTOs ---------- */

export interface CustomerUpdateDto {
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
}

/* ---------- Mapper ---------- */

/**
 * Wandelt ein rohes Dokument (Mongoose lean / normalized) in ein typisiertes DTO um.
 * Zentraler Ort für alle Casts – der Rest des Codes bleibt cast-frei.
 */
export function toCustomerReadDto(raw: Record<string, unknown>): CustomerReadDto {
    return {
        id: String(raw._id ?? raw.id),
        _id: raw._id ? String(raw._id) : undefined,
        firstname: (raw.firstname as string) ?? "",
        lastname: (raw.lastname as string) ?? "",
        companyname: (raw.companyname as string) ?? "",
        email: (raw.email as string) ?? "",
        phone: (raw.phone as string) ?? "",
        address: (raw.address as string) ?? "",
        city: (raw.city as string) ?? null,
        postcode: (raw.postcode as string) ?? null,
        projectStatus: raw.projectStatus as CustomerReadDto["projectStatus"],
        reference: (raw.reference as string) ?? null,
        price: Number(raw.price ?? 0),
        finalPrice: Number(raw.finalPrice ?? raw.price ?? 0),
        discountRate: typeof raw.discountRate === "number" ? raw.discountRate : null,
        myReferralCode: (raw.myReferralCode as string) ?? null,
        referralCount: Number(raw.referralCount ?? 0),
        totalEarnings: Number(raw.totalEarnings ?? 0),
        createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt as string),
        updatedAt: raw.updatedAt instanceof Date ? raw.updatedAt : new Date(raw.updatedAt as string),
    };
}

export function toCustomerListItemDto(raw: Record<string, unknown>): CustomerListItemDto {
    return {
        id: String(raw._id ?? raw.id),
        firstname: (raw.firstname as string) ?? "",
        lastname: (raw.lastname as string) ?? "",
        companyname: (raw.companyname as string) ?? "",
        email: (raw.email as string) ?? "",
        price: Number(raw.price ?? 0),
        finalPrice: Number(raw.finalPrice ?? raw.price ?? 0),
        referralCount: Number(raw.referralCount ?? 0),
        totalEarnings: Number(raw.totalEarnings ?? 0),
        createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt as string),
    };
}
