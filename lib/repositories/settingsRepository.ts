/**
 * Settings Repository – Datenbankzugriff für Settings via Mongoose.
 *
 * Ersetzt die direkte Model-Nutzung in discountSettings.ts (DIP-Fix).
 */

import SettingsModel from "@/models/Settings";
import { connectToMongo } from "@/lib/mongodb";

export const settingsRepository = {
    findByKey: async (key: string) => {
        await connectToMongo();
        return SettingsModel.findOne({ key }).lean().exec();
    },

    upsertBoolean: async (key: string, booleanValue: boolean) => {
        await connectToMongo();
        await SettingsModel.updateOne(
            { key },
            { $set: { booleanValue } },
            { upsert: true },
        ).exec();
        return booleanValue;
    },

    create: async (data: { key: string; booleanValue?: boolean }) => {
        await connectToMongo();
        return SettingsModel.create(data);
    },
};
