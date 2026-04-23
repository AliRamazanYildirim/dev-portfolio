/**
 * JWT Token Revocation (Blacklist).
 *
 * Persistiert den `jti` widerrufener Tokens bis zum ursprünglichen Ablaufzeitpunkt.
 * Der TTL-Index des Models entfernt Einträge automatisch nach Ablauf.
 * Node-Runtime only (MongoDB-Zugriff).
 */

import { connectToMongo } from "@/lib/mongodb";
import { getRevokedTokenModel } from "@/models/RevokedToken";

export async function revokeToken(jti: string, expUnixSeconds: number): Promise<void> {
    if (!jti || !Number.isFinite(expUnixSeconds)) return;

    await connectToMongo();
    const model = getRevokedTokenModel();
    await model.updateOne(
        { jti },
        {
            $setOnInsert: {
                jti,
                expiresAt: new Date(expUnixSeconds * 1000),
                revokedAt: new Date(),
            },
        },
        { upsert: true },
    );
}

export async function isTokenRevoked(jti: string | undefined): Promise<boolean> {
    if (!jti) return false;

    await connectToMongo();
    const model = getRevokedTokenModel();
    const hit = await model.exists({ jti });
    return hit !== null;
}
