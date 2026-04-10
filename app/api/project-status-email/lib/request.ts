const DEFAULT_PUBLIC_BASE_URL = "https://www.arytechsolutions.com";

function normalizeBaseUrl(raw: string | undefined): string | undefined {
    if (!raw) {
        return undefined;
    }

    try {
        const url = new URL(raw);
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            return undefined;
        }

        return `${url.protocol}//${url.host}`;
    } catch {
        return undefined;
    }
}

function resolveConfiguredBaseUrl(): string | undefined {
    return normalizeBaseUrl(
        process.env.APP_BASE_URL?.trim() ||
        process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        DEFAULT_PUBLIC_BASE_URL,
    );
}

const CONFIGURED_BASE_URL = resolveConfiguredBaseUrl();

export function buildBaseUrl(_req: Request): string | undefined {
    return CONFIGURED_BASE_URL;
}
