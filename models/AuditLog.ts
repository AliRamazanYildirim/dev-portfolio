import mongoose from "mongoose";

const AUDIT_LOG_MODEL = "AuditLog";

export type AuditAction =
    | "admin.login"
    | "admin.login.failed"
    | "admin.logout"
    | "customer.create"
    | "customer.update"
    | "customer.delete"
    | "project.create"
    | "project.update"
    | "project.delete"
    | "discount.update"
    | "discount.delete"
    | "invoice.send"
    | "referral.send"
    | "upload.image";

interface AuditLogDoc extends mongoose.Document {
    action: AuditAction;
    actorId: string | null;
    actorEmail: string | null;
    targetId: string | null;
    ip: string | null;
    userAgent: string | null;
    success: boolean;
    metadata: Record<string, unknown>;
    createdAt: Date;
}

const AuditLogSchema = new mongoose.Schema<AuditLogDoc>(
    {
        action: { type: String, required: true, index: true },
        actorId: { type: String, default: null },
        actorEmail: { type: String, default: null },
        targetId: { type: String, default: null, index: true },
        ip: { type: String, default: null },
        userAgent: { type: String, default: null },
        success: { type: Boolean, required: true, default: true },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: { createdAt: true, updatedAt: false } },
);

AuditLogSchema.index({ createdAt: -1 });

export function getAuditLogModel(): mongoose.Model<AuditLogDoc> {
    if (mongoose.models[AUDIT_LOG_MODEL]) {
        return mongoose.models[AUDIT_LOG_MODEL] as mongoose.Model<AuditLogDoc>;
    }
    return mongoose.model<AuditLogDoc>(AUDIT_LOG_MODEL, AuditLogSchema);
}

export type { AuditLogDoc };
