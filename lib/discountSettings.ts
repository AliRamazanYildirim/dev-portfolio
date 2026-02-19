import { settingsRepository } from "@/lib/repositories/settingsRepository";

const DISCOUNTS_KEY = "discountsEnabled";

export async function getDiscountsEnabled(): Promise<boolean> {
  const existing = await settingsRepository.findByKey(DISCOUNTS_KEY);

  if (existing && typeof existing.booleanValue === "boolean") {
    return existing.booleanValue;
  }

  const created = await settingsRepository.create({ key: DISCOUNTS_KEY, booleanValue: true });
  return created.booleanValue ?? true;
}

export async function setDiscountsEnabled(enabled: boolean): Promise<boolean> {
  return settingsRepository.upsertBoolean(DISCOUNTS_KEY, enabled);
}
