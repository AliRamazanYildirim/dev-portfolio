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
    await connectToMongo()
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

    // Create new window. This can race when multiple processes try to create the
    // same key at the same time resulting in a duplicate-key error. In that case
    // we catch the error and re-run the increment query to obtain the current
    // counters instead of failing hard.
    try {
        const created = await Model.create({ key, count: 1, expiresAt });
        return {
            allowed: 1 <= limit,
            meta: {
                limit,
                remaining: Math.max(0, limit - 1),
                reset: Math.floor(expiresAt.getTime() / 1000),
            },
        }
    } catch (err: any) {
        // Duplicate key (another process created the doc at the same time)
        const isDupKey = err && (err.code === 11000 || err.name === 'MongoServerError' && err.code === 11000);
        if (isDupKey) {
            // Try to fetch and increment the document that was just created by the
            // other process. If that still fails, rethrow the original error.
            const bumped = await Model.findOneAndUpdate(
                { key, expiresAt: { $gt: now } },
                { $inc: { count: 1 } },
                { new: true }
            ).exec();

            if (bumped) {
                return {
                    allowed: bumped.count <= limit,
                    meta: {
                        limit,
                        remaining: Math.max(0, limit - bumped.count),
                        reset: Math.floor(bumped.expiresAt.getTime() / 1000),
                    },
                }
            }
        }

        // If it's not a duplicate-key error or we couldn't recover, rethrow
        throw err;
    }
}

export default { checkRateLimitKey }
