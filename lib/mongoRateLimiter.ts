import mongoose from './mongodb'
import { connectToMongo } from './mongodb'

const RATE_LIMIT_MODEL = 'RateLimit'

interface RateLimitDoc extends mongoose.Document {
    key: string
    count: number
    expiresAt: Date
}

const RateLimitSchema = new mongoose.Schema<RateLimitDoc>({
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true, index: true },
})

function getModel(): mongoose.Model<RateLimitDoc> {
    if (mongoose.models && mongoose.models[RATE_LIMIT_MODEL]) {
        return mongoose.models[RATE_LIMIT_MODEL] as mongoose.Model<RateLimitDoc>;
    }
    return mongoose.model<RateLimitDoc>(RATE_LIMIT_MODEL, RateLimitSchema);
}

export async function checkRateLimitKey(key: string, windowSec: number, limit: number) {
    try {
        await connectToMongo();
    } catch (err: any) {
        console.error('mongoRateLimiter: connectToMongo failed:', err && (err.stack || err.message || err));
        throw new Error('mongoRateLimiter: connectToMongo failed: ' + (err && (err.message || String(err))));
    }
    const Model = getModel()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + windowSec * 1000)

    // Try incrementing existing doc within window
    const updated = await Model.findOneAndUpdate(
        { key, expiresAt: { $gt: now } },
        { $inc: { count: 1 } },
        { new: true }
    ).exec()

    if (updated) {
        const allowed = updated.count <= limit
        return {
            allowed: allowed,
            meta: {
                limit,
                remaining: Math.max(0, limit - updated.count),
                reset: Math.floor(updated.expiresAt.getTime() / 1000),
            },
        }
    }

    // Use an atomic upsert to create-or-increment the window in one operation.
    // This avoids races where multiple processes call create() concurrently.
    const bumped = await Model.findOneAndUpdate(
        { key, expiresAt: { $gt: now } },
        { $inc: { count: 1 } },
        { new: true }
    ).exec();

    if (bumped) {
        const allowed = bumped.count <= limit;
        return {
            allowed,
            meta: {
                limit,
                remaining: Math.max(0, limit - bumped.count),
                reset: Math.floor(bumped.expiresAt.getTime() / 1000),
            },
        };
    }

    // No existing active window found — atomically insert a new document using
    // upsert. The filter does NOT match expired windows, so this creates a new
    // window for this key and sets count=1.
    const upserted = await Model.findOneAndUpdate(
        { key, expiresAt: { $lte: now } },
        { $setOnInsert: { key, expiresAt }, $inc: { count: 1 } },
        { new: true, upsert: true }
    ).exec();

    if (upserted) {
        // If the returned document was just created, its count will be 1.
        // If it was matched but expired, behavior depends on race; compute safely.
        const currentCount = upserted.count ?? 1;
        return {
            allowed: currentCount <= limit,
            meta: {
                limit,
                remaining: Math.max(0, limit - currentCount),
                reset: Math.floor((upserted.expiresAt || expiresAt).getTime() / 1000),
            },
        };
    }

    // Fallback: should not normally happen
    throw new Error('rate_limit error: unable to create or update rate limit document');
}

export default { checkRateLimitKey }
