/**
 * Shared helper to normalize Mongoose documents.
 * Adds `id` (string) from `_id` for consistent API responses.
 */
export function normalizeDoc<T = any>(doc: any): T | null {
    if (!doc) return null;
    if (Array.isArray(doc))
        return doc.map((d) => normalizeDoc(d)) as unknown as T;
    const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
    if (obj && obj._id && !obj.id) obj.id = String(obj._id);
    return obj as T;
}
