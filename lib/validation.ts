/**
 * Zentrale Validation-Utilities.
 *
 * Einmalig definierte Hilfsfunktionen, die in allen Validierungsmodulen
 * wiederverwendet werden — kein duplizierter Email-Regex mehr.
 */

/** RFC-5322-kompatible, praxistaugliche E-Mail-Regex */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Prüft ob ein String eine gültige E-Mail-Adresse ist.
 */
export function isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
}

/**
 * Prüft ob ein Wert ein nicht-leerer String ist.
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

/**
 * Prüft ob ein Wert eine positive Zahl ist.
 */
export function isPositiveNumber(value: unknown): value is number {
    const num = typeof value === "number" ? value : Number(value);
    return !Number.isNaN(num) && num > 0;
}

/**
 * Sichere Umwandlung zu Zahl; gibt null zurück wenn ungültig.
 */
export function toSafeNumber(value: unknown): number | null {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) return parsed;
    }
    return null;
}

/**
 * Konvertiert einen beliebigen Datumswert sicher zu ISO-String.
 */
export function toIsoString(value: unknown): string | null {
    if (!value) return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value.toISOString();
    }
    const parsed = new Date(value as string);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/* ---------- Normalization / Sanitization (NEU) ---------- */

/**
 * Trimmt und normalisiert einen String-Wert.
 * Gibt den Fallback zurück wenn leer/kein String.
 */
export function sanitizeString(value: unknown, fallback = ""): string {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    return trimmed || fallback;
}

/**
 * Trimmt und gibt null zurück wenn leer.
 */
export function sanitizeOptionalString(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed || null;
}

/**
 * Sichere ID-Validierung (nicht leer, kein Whitespace).
 */
export function isValidId(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0 && !/\s/.test(value);
}

/**
 * Prüft ob ein Wert ein gültiger MongoDB ObjectId oder CUID ist.
 */
export function isValidDocumentId(value: unknown): value is string {
    if (typeof value !== "string") return false;
    // MongoDB ObjectId (24 hex chars)
    if (/^[a-f\d]{24}$/i.test(value)) return true;
    // CUID2 (starts with letter, 21-32 chars)
    if (/^[a-z][a-z0-9]{20,31}$/i.test(value)) return true;
    return false;
}
