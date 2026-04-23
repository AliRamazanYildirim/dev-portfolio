/**
 * Audit Logging fuer Admin-Aktionen.
 *
 * API: `recordAudit({...})` — feuert fire-and-forget, schluckt Fehler,
 * damit ein Logging-Ausfall niemals das Business-Flow-Ergebnis blockiert.
 */

import { connectToMongo } from "@/lib/mongodb";
import { getAuditLogModel, type AuditAction } from "@/models/AuditLog";

export interface AuditEvent {
    action: AuditAction;
    actorId?: string | null;
    actorEmail?: string | null;
    targetId?: string | null;
    ip?: string | null;
    userAgent?: string | null;
    success?: boolean;
    metadata?: Record<string, unknown>;
}

export async function recordAudit(event: AuditEvent): Promise<void> {
    try {
        await connectToMongo();
        const model = getAuditLogModel();
        await model.create({
            action: event.action,
            actorId: event.actorId ?? null,
            actorEmail: event.actorEmail ?? null,
            targetId: event.targetId ?? null,
            ip: event.ip ?? null,
            userAgent: event.userAgent ?? null,
            success: event.success ?? true,
            metadata: event.metadata ?? {},
        });
    } catch (error) {
        console.error("recordAudit failed", event.action, error);
    }
}
