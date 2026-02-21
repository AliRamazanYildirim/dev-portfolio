/**
 * Admin Auth – Domain-Typen.
 *
 * Extrahiert aus service.ts für einheitliche Domain-Struktur.
 */

import type { AdminUser } from "@/lib/auth";

export interface LoginResult {
    token: string;
    user: AdminUser;
}

export interface SessionResult {
    user: AdminUser;
}
