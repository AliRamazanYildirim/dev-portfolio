/**
 * Repository Error Types – Strukturierte Fehler auf Repository-Ebene.
 *
 * Ersetzt String-Matching (E11000, duplicate key, email_1) durch
 * typisierte Error-Codes. Domain-Services prüfen den Code statt
 * fragile Regex/Includes auf Error-Messages.
 */

/* ================================================================
 * ERROR CODES – Discriminated Union
 * ================================================================ */

export const RepositoryErrorCode = {
    DUPLICATE_KEY: "DUPLICATE_KEY",
    NOT_FOUND: "NOT_FOUND",
    VALIDATION: "VALIDATION",
    CONNECTION: "CONNECTION",
    UNKNOWN: "UNKNOWN",
} as const;

export type RepositoryErrorCode = (typeof RepositoryErrorCode)[keyof typeof RepositoryErrorCode];

/* ================================================================
 * DUPLICATE KEY DETAILS
 * ================================================================ */

export interface DuplicateKeyInfo {
    /** Das Feld, das den Unique-Constraint verletzt (z.B. "email") */
    field: string | null;
    /** Der Wert, der doppelt ist (z.B. "test@example.com") */
    value: string | null;
}

/* ================================================================
 * REPOSITORY ERROR
 * ================================================================ */

export class RepositoryError extends Error {
    public readonly code: RepositoryErrorCode;
    public readonly duplicateKeyInfo: DuplicateKeyInfo | null;
    public readonly originalError: unknown;

    constructor(
        message: string,
        code: RepositoryErrorCode,
        originalError?: unknown,
        duplicateKeyInfo?: DuplicateKeyInfo,
    ) {
        super(message);
        this.name = "RepositoryError";
        this.code = code;
        this.duplicateKeyInfo = duplicateKeyInfo ?? null;
        this.originalError = originalError ?? null;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /** Typeguard: Prüft ob es sich um einen Duplicate-Key-Fehler handelt. */
    isDuplicateKey(): boolean {
        return this.code === RepositoryErrorCode.DUPLICATE_KEY;
    }
}

/* ================================================================
 * MONGODB ERROR CLASSIFIER – Zentrale Übersetzung
 * ================================================================ */

/**
 * Klassifiziert einen MongoDB/Mongoose-Fehler in einen typisierten RepositoryError.
 * Zentrale Stelle für alle String-Pattern-Matches – kein anderer Code muss
 * jemals auf Error-Messages prüfen.
 */
export function classifyMongoError(err: unknown): RepositoryError {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as Record<string, unknown>)?.code;

    // MongoDB Duplicate Key Error (E11000)
    if (
        code === 11000 ||
        message.includes("E11000") ||
        message.includes("duplicate key") ||
        message.includes("unique constraint")
    ) {
        const info = extractDuplicateKeyInfo(message);
        return new RepositoryError(
            `Duplicate value for field "${info.field ?? "unknown"}"`,
            RepositoryErrorCode.DUPLICATE_KEY,
            err,
            info,
        );
    }

    // MongoDB Validation Error
    if (message.includes("validation failed") || message.includes("ValidatorError")) {
        return new RepositoryError(
            message,
            RepositoryErrorCode.VALIDATION,
            err,
        );
    }

    // Connection Errors
    if (
        message.includes("ECONNREFUSED") ||
        message.includes("topology was destroyed") ||
        message.includes("connect ETIMEDOUT")
    ) {
        return new RepositoryError(
            "Database connection error",
            RepositoryErrorCode.CONNECTION,
            err,
        );
    }

    return new RepositoryError(message, RepositoryErrorCode.UNKNOWN, err);
}

/**
 * Extrahiert Feld und Wert aus einem MongoDB E11000 Error.
 *
 * Typische Formate:
 *   - `E11000 duplicate key error collection: db.customers index: email_1 dup key: { email: "x@y.com" }`
 *   - `E11000 ... index: email_1 dup key: { : "x@y.com" }`
 */
function extractDuplicateKeyInfo(message: string): DuplicateKeyInfo {
    // Versuche Feldnamen aus dem Index-Namen zu extrahieren
    const indexMatch = message.match(/index:\s*(\w+?)_\d+/);
    const field = indexMatch ? indexMatch[1] : null;

    // Versuche den Wert aus dem dup key zu extrahieren
    const valueMatch =
        message.match(/dup key:\s*\{\s*(?:\w+:\s*)?"([^"]+)"\s*\}/) ||
        message.match(/dup key:\s*\{\s*:\s*"([^"]+)"\s*\}/);
    const value = valueMatch ? valueMatch[1] : null;

    return { field, value };
}

/* ================================================================
 * TYPEGUARD
 * ================================================================ */

export function isRepositoryError(err: unknown): err is RepositoryError {
    return err instanceof RepositoryError;
}
