/**
 * Settings Repository – Datenbankzugriff für Settings via Mongoose.
 *
 * Ersetzt die direkte Model-Nutzung in discountSettings.ts (DIP-Fix).
 */

import SettingsModel from "@/models/Settings";
import { connectToMongo } from "@/lib/mongodb";
import { classifyMongoError } from "./errors";

export const settingsRepository = {
    findByKey: async (key: string) => {
        await connectToMongo();
        return SettingsModel.findOne({ key }).lean().exec();
    },

    upsertBoolean: async (key: string, booleanValue: boolean) => {
        await connectToMongo();
        try {
            await SettingsModel.updateOne(
                { key },
                { $set: { booleanValue } },
                { upsert: true },
            ).exec();
            return booleanValue;
        } catch (err) {
            throw classifyMongoError(err);
        }
    },

    create: async (data: { key: string; booleanValue?: boolean }) => {
        await connectToMongo();
        try {
            return SettingsModel.create(data);
        } catch (err) {
            throw classifyMongoError(err);
        }
    },
};
