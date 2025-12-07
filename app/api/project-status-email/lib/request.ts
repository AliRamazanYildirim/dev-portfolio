import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

export function extractCookie(req: Request, name: string) {
    const cookieHeader = (req as any).headers?.get?.("cookie") || "";
    if (!cookieHeader) {
        return null;
    }
    const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
    return match ? match[1] : null;
}

export function buildBaseUrl(req: Request) {
    const host = (req as any).headers?.get?.("host");
    if (!host) {
        return undefined;
    }
    const protocol = (req as any).headers?.get?.("x-forwarded-proto") || "https";
    return `${protocol}://${host}`;
}

export function ensureAuthenticated(req: Request) {
    const token = extractCookie(req, AUTH_COOKIE_NAME);
    if (!token) {
        return null;
    }
    return verifyToken(token);
}
