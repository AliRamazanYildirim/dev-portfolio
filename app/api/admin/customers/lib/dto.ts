/**
 * Customer Domain DTOs – Typ-sichere Read-/Write-Modelle.
 *
 * Eliminiert `unknown`/`as`-Cast-Ketten im gesamten Customer-Domain.
 * Jede Schicht arbeitet nur mit dem DTO, das sie braucht.
 */

import type { ICustomer } from "@/models/Customer";

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
 *
 * Overloads:
 *  - ICustomer: direkter Mapper ohne Cast-Risiko
 *  - Record<string, unknown>: Legacy-Kompatibilität für untypisierte Quellen
 */
export function toCustomerReadDto(raw: ICustomer): CustomerReadDto;
export function toCustomerReadDto(raw: Record<string, unknown>): CustomerReadDto;
export function toCustomerReadDto(raw: ICustomer | Record<string, unknown>): CustomerReadDto {
    const r = raw as Record<string, unknown>;
    return {
        id: String(r._id ?? r.id),
        _id: r._id ? String(r._id) : undefined,
        firstname: (r.firstname as string) ?? "",
        lastname: (r.lastname as string) ?? "",
        companyname: (r.companyname as string) ?? "",
        email: (r.email as string) ?? "",
        phone: (r.phone as string) ?? "",
        address: (r.address as string) ?? "",
        city: (r.city as string) ?? null,
        postcode: (r.postcode as string) ?? null,
        projectStatus: r.projectStatus as CustomerReadDto["projectStatus"],
        reference: (r.reference as string) ?? null,
        price: Number(r.price ?? 0),
        finalPrice: Number(r.finalPrice ?? r.price ?? 0),
        discountRate: typeof r.discountRate === "number" ? r.discountRate : null,
        myReferralCode: (r.myReferralCode as string) ?? null,
        referralCount: Number(r.referralCount ?? 0),
        totalEarnings: Number(r.totalEarnings ?? 0),
        createdAt: r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt as string),
        updatedAt: r.updatedAt instanceof Date ? r.updatedAt : new Date(r.updatedAt as string),
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
