/**
 * CSRF Double-Submit Token
 *
 * Kein httpOnly Cookie: Der Browser liest den Wert per JS und sendet ihn
 * zusätzlich im `x-csrf-token` Header. Der Proxy vergleicht Cookie + Header
 * in konstanter Zeit. Edge-kompatibel (Web Crypto API).
 */

export const CSRF_COOKIE_NAME = "csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

const TOKEN_BYTES = 32;
const TOKEN_MAX_LEN = 128;

/**
 * Erzeugt einen kryptographisch sicheren Token (URL-safe base64).
 */
export function generateCsrfToken(): string {
    const bytes = new Uint8Array(TOKEN_BYTES);
    crypto.getRandomValues(bytes);
    return toBase64Url(bytes);
}

/**
 * Konstantzeit-Vergleich von Cookie- und Header-Token.
 * Falsy/ungleiche Längen → false ohne Short-Circuit.
 */
export function verifyCsrfTokenPair(
    cookieToken: string | null | undefined,
    headerToken: string | null | undefined,
): boolean {
    if (!cookieToken || !headerToken) return false;
    if (cookieToken.length > TOKEN_MAX_LEN || headerToken.length > TOKEN_MAX_LEN) {
        return false;
    }
    if (cookieToken.length !== headerToken.length) return false;

    let diff = 0;
    for (let i = 0; i < cookieToken.length; i++) {
        diff |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
    }
    return diff === 0;
}

/**
 * Cookie-Optionen für den CSRF-Token.
 * `httpOnly = false`, damit der Client-Code den Wert lesen kann.
 */
export function getCsrfCookieOptions() {
    return {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
        maxAge: 24 * 60 * 60, // Sekunden
    };
}

function toBase64Url(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const base64 =
        typeof btoa === "function"
            ? btoa(binary)
            : Buffer.from(binary, "binary").toString("base64");
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
