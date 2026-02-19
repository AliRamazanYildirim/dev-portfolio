/**
 * Shared helper to normalize Mongoose documents.
 * Adds `id` (string) from `_id` for consistent API responses.
 *
 * Overloads provide correct return types:
 *  - Array input → non-null array return
 *  - Single input → nullable return
 */
export function normalizeDoc<T>(doc: T[]): T[];
export function normalizeDoc<T>(doc: T | null | undefined): T | null;
export function normalizeDoc<T>(doc: T | T[] | null | undefined): T | T[] | null {
    if (!doc) return null;
    if (Array.isArray(doc))
        return doc.map((d) => normalizeDoc<T>(d)!);
    const obj: Record<string, unknown> =
        typeof (doc as Record<string, unknown> & { toObject?: () => Record<string, unknown> }).toObject === "function"
            ? (doc as Record<string, unknown> & { toObject: () => Record<string, unknown> }).toObject()
            : { ...(doc as Record<string, unknown>) };
    if (obj._id && !obj.id) obj.id = String(obj._id);
    return obj as T;
}
