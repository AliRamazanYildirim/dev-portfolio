/**
 * Admin Customers API – Input Validation
 */

import type { CreateCustomerRequest } from "./types";

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
