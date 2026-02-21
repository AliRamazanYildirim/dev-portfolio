import { NextRequest } from "next/server";

export function extractSessionToken(request: NextRequest, cookieName: string): string | undefined {
    return request.cookies.get(cookieName)?.value;
}
