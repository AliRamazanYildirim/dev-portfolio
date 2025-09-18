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

    // Perform a single atomic upsert using an aggregation pipeline. The pipeline
    // will either increment the existing active window's count, or reset/create
    // a new window with count=1 if expired or missing. Using a pipeline avoids
    // races that lead to duplicate-key errors on unique indexes.
    const result = await Model.findOneAndUpdate(
        { key },
        [
            { $set: { _existingExpires: { $ifNull: ["$expiresAt", new Date(0)] } } },
            { $set: { _isActive: { $gt: ["$_existingExpires", now] } } },
            {
                $set: {
                    count: {
                        $cond: [
                            { $eq: ["$_isActive", true] },
                            { $add: [{ $ifNull: ["$count", 0] }, 1] },
                            1,
                        ],
                    },
                    expiresAt: {
                        $cond: [{ $eq: ["$_isActive", true] }, "$_existingExpires", expiresAt],
                    },
                },
            },
            { $unset: ["_existingExpires", "_isActive"] },
        ],
        { new: true, upsert: true }
    ).exec();

    if (!result) {
        throw new Error('rate_limit error: unable to create or update rate limit document');
    }

    const currCount = result.count ?? 1;
    return {
        allowed: currCount <= limit,
        meta: {
            limit,
            remaining: Math.max(0, limit - currCount),
            reset: Math.floor((result.expiresAt || expiresAt).getTime() / 1000),
        },
    };
}

export default { checkRateLimitKey }
