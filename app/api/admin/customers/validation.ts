/**
 * Admin Customers API – Input Validation
 */

import type { CreateCustomerRequest, UpdateCustomerRequest } from "./types";
import { isValidEmail } from "@/lib/validation";

export function validateCreateCustomerBody(
    body: unknown,
): { valid: true; value: CreateCustomerRequest } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;

    const email = typeof obj.email === "string" ? obj.email.trim() : "";
    if (!email) {
        return { valid: false, error: "Email is required" };
    }

    if (!isValidEmail(email)) {
        return { valid: false, error: "Invalid email format" };
    }

    const price = typeof obj.price === "number" ? obj.price : Number(obj.price);
    if (!price || Number.isNaN(price) || price <= 0) {
        return { valid: false, error: "A valid positive price is required" };
    }

    return {
        valid: true,
        value: {
            firstname: typeof obj.firstname === "string" ? obj.firstname.trim() : "",
            lastname: typeof obj.lastname === "string" ? obj.lastname.trim() : "",
            companyname: typeof obj.companyname === "string" ? obj.companyname.trim() : "",
            email,
            phone: typeof obj.phone === "string" ? obj.phone.trim() : "",
            address: typeof obj.address === "string" ? obj.address.trim() : "",
            city: typeof obj.city === "string" ? obj.city.trim() : null,
            postcode: typeof obj.postcode === "string" ? obj.postcode.trim() : null,
            reference: typeof obj.reference === "string" && obj.reference.trim() ? obj.reference.trim() : null,
            price,
            language: typeof obj.language === "string" ? obj.language : "de",
            createdAt: typeof obj.createdAt === "string" ? obj.createdAt : undefined,
        },
    };
}

/**
 * Validiert den Body für recalc-final Endpoint.
 */
export function validateRecalcBody(
    body: unknown,
): { valid: true; value: { customerId: string } } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const { customerId } = body as Record<string, unknown>;
    if (!customerId || typeof customerId !== "string") {
        return { valid: false, error: "customerId is required" };
    }

    return { valid: true, value: { customerId } };
}

/**
 * Validiert den Body für Kunden-Update (PUT [id]).
 * Alle Felder optional – aber wenn angegeben, müssen sie gültig sein.
 */
export function validateUpdateCustomerBody(
    body: unknown,
): { valid: true; value: UpdateCustomerRequest } | { valid: false; error: string } {
    if (!body || typeof body !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const obj = body as Record<string, unknown>;
    const result: UpdateCustomerRequest = {};

    if (obj.email !== undefined) {
        if (typeof obj.email !== "string" || !obj.email.trim()) {
            return { valid: false, error: "Email must be a non-empty string" };
        }
        if (!isValidEmail(obj.email.trim())) {
            return { valid: false, error: "Invalid email format" };
        }
        result.email = obj.email.trim();
    }

    if (obj.price !== undefined) {
        const price = typeof obj.price === "number" ? obj.price : Number(obj.price);
        if (Number.isNaN(price) || price < 0) {
            return { valid: false, error: "Price must be a valid non-negative number" };
        }
        result.price = price;
    }

    if (obj.firstname !== undefined) result.firstname = String(obj.firstname).trim();
    if (obj.lastname !== undefined) result.lastname = String(obj.lastname).trim();
    if (obj.companyname !== undefined) result.companyname = String(obj.companyname).trim();
    if (obj.phone !== undefined) result.phone = String(obj.phone).trim();
    if (obj.address !== undefined) result.address = String(obj.address).trim();
    if (obj.city !== undefined) result.city = obj.city === null ? null : String(obj.city).trim();
    if (obj.postcode !== undefined) result.postcode = obj.postcode === null ? null : String(obj.postcode).trim();
    if (obj.reference !== undefined) result.reference = obj.reference === null ? null : String(obj.reference).trim();

    if (obj.referralCount !== undefined) {
        const count = Number(obj.referralCount);
        if (Number.isNaN(count) || count < 0) {
            return { valid: false, error: "referralCount must be a non-negative number" };
        }
        result.referralCount = count;
    }

    if (obj.projectStatus !== undefined) {
        const validStatuses = ["gestart", "in-vorbereitung", "abgeschlossen"];
        if (!validStatuses.includes(obj.projectStatus as string)) {
            return { valid: false, error: `projectStatus must be one of: ${validStatuses.join(", ")}` };
        }
        result.projectStatus = obj.projectStatus as UpdateCustomerRequest["projectStatus"];
    }

    return { valid: true, value: result };
}
