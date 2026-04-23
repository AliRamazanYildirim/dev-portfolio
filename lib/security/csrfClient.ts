/**
 * CSRF Client Helper
 *
 * Ergänzt `fetch` um automatisches Laden und Mitsenden des CSRF-Tokens
 * für mutating Requests. Nur im Browser nutzbar.
 */

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "./csrf";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const CSRF_ENDPOINT = "/api/csrf";

function readCsrfCookie(): string | null {
    if (typeof document === "undefined") return null;
    const pattern = new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]+)`);
    const match = document.cookie.match(pattern);
    return match ? decodeURIComponent(match[1]!) : null;
}

async function fetchCsrfToken(): Promise<string | null> {
    try {
        const res = await fetch(CSRF_ENDPOINT, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });
        if (!res.ok) return null;
        const json = (await res.json()) as { data?: { token?: string } };
        return json.data?.token ?? readCsrfCookie();
    } catch {
        return null;
    }
}

/**
 * Liefert einen gültigen CSRF-Token, fragt ggf. einen neuen beim Server an.
 */
export async function ensureCsrfToken(): Promise<string | null> {
    return readCsrfCookie() ?? (await fetchCsrfToken());
}

/**
 * fetch-Wrapper, der bei unsicheren Methoden automatisch den CSRF-Header setzt.
 * Bestehende Header/Optionen bleiben unverändert.
 */
export async function secureFetch(
    input: RequestInfo | URL,
    init: RequestInit = {},
): Promise<Response> {
    const method = (init.method ?? "GET").toUpperCase();

    if (!UNSAFE_METHODS.has(method)) {
        return fetch(input, init);
    }

    const token = await ensureCsrfToken();
    const headers = new Headers(init.headers);
    if (token) headers.set(CSRF_HEADER_NAME, token);

    return fetch(input, {
        ...init,
        headers,
        credentials: init.credentials ?? "include",
    });
}
