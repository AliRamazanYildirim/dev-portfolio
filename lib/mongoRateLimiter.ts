import mongoose from './mongodb'
import { connectToMongo } from './mongodb'

const RATE_LIMIT_MODEL = 'RateLimit'
const EXPIRES_AT_INDEX_KEY = { expiresAt: 1 } as const
const EXPIRES_AT_INDEX_FIELD = 'expiresAt'
const EXPIRES_AT_TTL_SECONDS = 0

interface RateLimitDoc extends mongoose.Document {
    key: string
    count: number
    expiresAt: Date
}

export interface RateLimitMeta {
    limit: number
    remaining: number
    reset: number
}

export interface RateLimitResult {
    allowed: boolean
    meta: RateLimitMeta
}

const RateLimitSchema = new mongoose.Schema<RateLimitDoc>({
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true },
})

// Remove stale limiter windows automatically.
RateLimitSchema.index(
    EXPIRES_AT_INDEX_KEY,
    { expireAfterSeconds: EXPIRES_AT_TTL_SECONDS },
)

let ensureIndexesPromise: Promise<void> | null = null;

function getModel(): mongoose.Model<RateLimitDoc> {
    if (mongoose.models && mongoose.models[RATE_LIMIT_MODEL]) {
        return mongoose.models[RATE_LIMIT_MODEL] as mongoose.Model<RateLimitDoc>;
    }
    return mongoose.model<RateLimitDoc>(RATE_LIMIT_MODEL, RateLimitSchema);
}

function toMeta(limit: number, count: number, resetDate: Date): RateLimitMeta {
    return {
        limit,
        remaining: Math.max(0, limit - count),
        reset: Math.floor(resetDate.getTime() / 1000),
    };
}

type MongoIndexInfo = {
    name?: string
    key?: Record<string, number>
    expireAfterSeconds?: number
}

function isSingleExpiresAtIndex(index: MongoIndexInfo): boolean {
    if (!index.key) {
        return false
    }

    const fields = Object.keys(index.key)
    return fields.length === 1 && index.key[EXPIRES_AT_INDEX_FIELD] === 1
}

async function dropIndexIfExists(collection: mongoose.Collection, indexName: string): Promise<void> {
    try {
        await collection.dropIndex(indexName)
    } catch (error: unknown) {
        const codeName =
            typeof error === 'object' &&
                error !== null &&
                'codeName' in error
                ? String((error as { codeName?: unknown }).codeName)
                : ''

        if (codeName !== 'IndexNotFound') {
            throw error
        }
    }
}

async function ensureRateLimitIndexes(): Promise<void> {
    if (ensureIndexesPromise) {
        return ensureIndexesPromise;
    }

    ensureIndexesPromise = (async () => {
        const collection = getModel().collection
        const indexes = (await collection.indexes()) as MongoIndexInfo[]
        const expiresAtIndex = indexes.find(isSingleExpiresAtIndex)

        const hasDesiredTtlIndex =
            Boolean(expiresAtIndex) &&
            expiresAtIndex?.expireAfterSeconds === EXPIRES_AT_TTL_SECONDS

        if (hasDesiredTtlIndex) {
            return
        }

        if (expiresAtIndex?.name) {
            await dropIndexIfExists(collection, expiresAtIndex.name)
        }

        await collection.createIndex(EXPIRES_AT_INDEX_KEY, {
            expireAfterSeconds: EXPIRES_AT_TTL_SECONDS,
        })
    })()
        .then(() => undefined)
        .catch((error: unknown) => {
            ensureIndexesPromise = null;
            throw error;
        });

    return ensureIndexesPromise;
}

async function ensureMongoConnection(): Promise<void> {
    try {
        await connectToMongo();
        await ensureRateLimitIndexes();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('mongoRateLimiter: connectToMongo failed:', error);
        throw new Error(`mongoRateLimiter: connectToMongo failed: ${message}`);
    }
}

export async function checkRateLimitKey(key: string, windowSec: number, limit: number): Promise<RateLimitResult> {
    await ensureMongoConnection();
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
        meta: toMeta(limit, currCount, result.expiresAt || expiresAt),
    };
}

export async function getRateLimitKeyStatus(key: string, windowSec: number, limit: number): Promise<RateLimitResult> {
    await ensureMongoConnection();

    const Model = getModel();
    const now = new Date();
    const fallbackReset = new Date(now.getTime() + windowSec * 1000);

    const doc = await Model.findOne({ key }).exec();

    if (!doc || doc.expiresAt <= now) {
        if (doc && doc.expiresAt <= now) {
            await Model.deleteOne({ key }).exec();
        }

        return {
            allowed: true,
            meta: toMeta(limit, 0, fallbackReset),
        };
    }

    const currentCount = doc.count ?? 0;
    return {
        allowed: currentCount < limit,
        meta: toMeta(limit, currentCount, doc.expiresAt),
    };
}

export async function resetRateLimitKey(key: string): Promise<void> {
    await ensureMongoConnection();
    const Model = getModel();
    await Model.deleteOne({ key }).exec();
}

export async function setRateLimitKeyWindow(key: string, windowSec: number): Promise<RateLimitResult> {
    await ensureMongoConnection();

    const Model = getModel();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + windowSec * 1000);

    const doc = await Model.findOneAndUpdate(
        { key },
        { $set: { key, count: 1, expiresAt } },
        { new: true, upsert: true },
    ).exec();

    if (!doc) {
        throw new Error('rate_limit error: unable to set rate limit window');
    }

    return {
        allowed: false,
        meta: toMeta(1, 1, doc.expiresAt || expiresAt),
    };
}

const mongoRateLimiter = {
    checkRateLimitKey,
    getRateLimitKeyStatus,
    resetRateLimitKey,
    setRateLimitKeyWindow,
};

export default mongoRateLimiter;
