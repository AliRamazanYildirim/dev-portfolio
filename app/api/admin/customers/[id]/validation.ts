import { ValidationError } from "@/lib/errors";
import { validateUpdateCustomerBody } from "../validation";
import type { CustomerIdParams, CustomerUpdateRequest } from "./types";

export function validateCustomerId(id: string): CustomerIdParams {
    const normalized = id.trim();
    if (!normalized) {
        throw new ValidationError("Customer id is required");
    }

    return { id: normalized };
}

export function validateUpdateBody(
    body: unknown,
): { valid: true; value: CustomerUpdateRequest } | { valid: false; error: string } {
    return validateUpdateCustomerBody(body);
}
