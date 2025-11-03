import mongoose from "mongoose";

/**
 * Reuse global mongoose connection in development to avoid model overwrite issues
 */
const globalForMongoose = globalThis as unknown as { mongoose?: typeof mongoose };

export async function connectToMongo() {
    const MONGODB_URI = process.env.MONGODB_URI || "";

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    if (globalForMongoose.mongoose) {
        return globalForMongoose.mongoose.connection;
    }

    const conn = await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        w: "majority",
    });

    globalForMongoose.mongoose = mongoose;
    return conn.connection;
}

export default mongoose;
