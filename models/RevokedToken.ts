import mongoose from "mongoose";

const REVOKED_TOKEN_MODEL = "RevokedToken";

interface RevokedTokenDoc extends mongoose.Document {
    jti: string;
    expiresAt: Date;
    revokedAt: Date;
}

const RevokedTokenSchema = new mongoose.Schema<RevokedTokenDoc>({
    jti: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, required: true, default: () => new Date() },
});

// TTL: Dokument wird automatisch entfernt sobald `expiresAt` erreicht ist.
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export function getRevokedTokenModel(): mongoose.Model<RevokedTokenDoc> {
    if (mongoose.models[REVOKED_TOKEN_MODEL]) {
        return mongoose.models[REVOKED_TOKEN_MODEL] as mongoose.Model<RevokedTokenDoc>;
    }
    return mongoose.model<RevokedTokenDoc>(REVOKED_TOKEN_MODEL, RevokedTokenSchema);
}

export type { RevokedTokenDoc };
