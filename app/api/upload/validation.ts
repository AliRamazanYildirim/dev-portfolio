/**
 * Upload API – Input Validation
 */

export function validateUploadFile(
    file: File | null,
): { valid: true; value: File } | { valid: false; error: string } {
    if (!file) {
        return { valid: false, error: "File not found" };
    }

    // Erlaubte Bildformate
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(", ")}`,
        };
    }

    // Max 10 MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 10MB`,
        };
    }

    return { valid: true, value: file };
}
