/**
 * Contact Service - Business Logic Layer
 * Separiert Business Logic von HTTP Handler
 */

import { randomUUID } from "crypto";
import { contactRepository } from "@/lib/repositories";
import {
    CreateContactRequest,
    ContactMessage,
    GetContactsQuery,
    RateLimitMeta,
    RateLimitResult,
} from "./types";
import { sanitizeContactInput } from "./validation";
import { NextRequest } from "next/server";
import { getIpFromHeaders } from "@/lib/ip";
import { checkRateLimitKey } from "@/lib/mongoRateLimiter";

// Rate Limit Konfiguration konstanten
const RATE_LIMIT_CONFIG = {
    POST: { limit: 3, window: 60 }, // 3 POST pro Minute
    GET: { limit: 60, window: 60 }, // 60 GET pro Minute
} as const;

export class ContactService {
    /**
     * Speichert eine neue Kontakt-Nachricht
     * @param data - Validierte Contact Request Daten
     * @returns Gespeicherte Contact Message oder Error
     */
    static async createContact(
        data: CreateContactRequest
    ): Promise<{ success: true; data: ContactMessage } | { success: false; error: string }> {
        try {
            const sanitized = sanitizeContactInput(data);
            const id = randomUUID();

            const created = await contactRepository.create({
                data: {
                    id,
                    ...sanitized,
                    createdAt: new Date(),
                },
            });

            return {
                success: true,
                data: created as ContactMessage,
            };
        } catch (error) {
            console.error("ContactService.createContact error:", error);
            return {
                success: false,
                error: "Failed to save contact message",
            };
        }
    }

    /**
     * Ruft Kontakt-Nachrichten ab (mit optionalen Filtern)
     * @param query - Query Parameter
     * @returns Array von Contact Messages oder Error
     */
    static async getContacts(
        query: GetContactsQuery
    ): Promise<{ success: true; data: ContactMessage[]; count: number } | { success: false; error: string }> {
        try {
            const where: Record<string, unknown> = {};

            // Optional: Filtere nur ungelesene
            if (query.unreadOnly) {
                where.read = false;
            }

            const messages = await contactRepository.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: query.limit || undefined,
            });

            return {
                success: true,
                data: (messages ?? []) as ContactMessage[],
                count: messages?.length ?? 0,
            };
        } catch (error) {
            console.error("ContactService.getContacts error:", error);
            return {
                success: false,
                error: "Failed to fetch messages",
            };
        }
    }

    /**
     * Prüft Rate Limit für einen Request
     * @param request - NextRequest Object
     * @param scope - "GET" oder "POST"
     * @returns Rate Limit Result mit Meta-Info
     */
    static async checkRateLimit(
        request: NextRequest,
        scope: "GET" | "POST"
    ): Promise<RateLimitResult> {
        try {
            const ip = getIpFromHeaders(request.headers);
            const key = `ip:${ip}:/api/contact:${scope}`;
            const config = RATE_LIMIT_CONFIG[scope];

            const result = await checkRateLimitKey(key, config.window, config.limit);

            return {
                allowed: result.allowed,
                meta: result.meta,
            };
        } catch (error) {
            console.error("ContactService.checkRateLimit error:", error);
            throw new Error(
                `Rate limit check failed: ${error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }
}
