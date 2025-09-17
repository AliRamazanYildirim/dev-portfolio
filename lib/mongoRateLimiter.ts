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

    // Create new window
    const created = await Model.create({ key, count: 1, expiresAt });
    return {
        allowed: 1 <= limit,
        meta: {
            limit,
            remaining: Math.max(0, limit - 1),
            reset: Math.floor(expiresAt.getTime() / 1000),
        },
    }
}

export default { checkRateLimitKey }
