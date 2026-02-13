// Auth is now handled centrally by middleware.ts.
// Only buildBaseUrl remains as a utility for constructing URLs in emails.

export function buildBaseUrl(req: Request) {
    const host = (req as any).headers?.get?.("host");
    if (!host) {
        return undefined;
    }
    const protocol = (req as any).headers?.get?.("x-forwarded-proto") || "https";
    return `${protocol}://${host}`;
}
