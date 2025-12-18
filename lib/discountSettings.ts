import SettingsModel from "@/models/Settings";
import { connectToMongo } from "./mongodb";

const DISCOUNTS_KEY = "discountsEnabled";

export async function getDiscountsEnabled(): Promise<boolean> {
  await connectToMongo();
  const existing = await SettingsModel.findOne({ key: DISCOUNTS_KEY })
    .lean()
    .exec();

  if (existing && typeof existing.booleanValue === "boolean") {
    return existing.booleanValue;
  }

  const created = await SettingsModel.create({ key: DISCOUNTS_KEY, booleanValue: true });
  return created.booleanValue ?? true;
}

export async function setDiscountsEnabled(enabled: boolean): Promise<boolean> {
  await connectToMongo();
  await SettingsModel.updateOne(
    { key: DISCOUNTS_KEY },
    { $set: { booleanValue: enabled } },
    { upsert: true }
  ).exec();

  return enabled;
}
