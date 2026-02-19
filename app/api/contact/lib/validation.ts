/**
 * Contact API Validation Logic
 * Alle Input-Validierungen zentralisiert
 */

import { CreateContactRequest } from "./types";
import { isValidEmail } from "@/lib/validation";

export { isValidEmail };

/**
 * Validiert ob alle erforderlichen Felder vorhanden sind
 * @param data - zu validierende Daten
 * @returns { valid: boolean; error?: string }
 */
export function validateCreateContactRequest(
    data: unknown
): { valid: boolean; error?: string } {
    if (!data || typeof data !== "object") {
        return { valid: false, error: "Invalid request body" };
    }

    const { name, email, message } = data as Record<string, unknown>;

    // Prüfe auf erforderliche Felder
    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return { valid: false, error: "Name is required and must be a non-empty string" };
    }

    if (!email || typeof email !== "string" || email.trim().length === 0) {
        return { valid: false, error: "Email is required and must be a non-empty string" };
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
        return { valid: false, error: "Message is required and must be a non-empty string" };
    }

    // Validiere Email Format
    if (!isValidEmail(email)) {
        return { valid: false, error: "Invalid email format" };
    }

    // Optional: Längen-Validierung
    if (name.length > 100) {
        return { valid: false, error: "Name must not exceed 100 characters" };
    }

    if (message.length > 5000) {
        return { valid: false, error: "Message must not exceed 5000 characters" };
    }

    return { valid: true };
}

/**
 * Sanitize Input vor DB-Speicherung
 * @param data - zu bereinigende Daten
 * @returns bereinigte Daten
 */
export function sanitizeContactInput(
    data: CreateContactRequest
): CreateContactRequest {
    return {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        message: data.message.trim(),
    };
}
