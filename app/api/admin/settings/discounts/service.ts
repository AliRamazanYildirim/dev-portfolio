/**
 * Admin Settings / Discounts – Service Layer.
 *
 * Kapselt die Business-Logik für Discount-Settings (SRP).
 * Route-Handler delegiert nur an diesen Service.
 */

import { getDiscountsEnabled, setDiscountsEnabled } from "@/lib/discountSettings";
import type { DiscountSettingsResult } from "./types";

export class DiscountSettingsService {
    static async getSettings(): Promise<DiscountSettingsResult> {
        const enabled = await getDiscountsEnabled();
        return { enabled };
    }

    static async updateSettings(enabled: boolean): Promise<DiscountSettingsResult> {
        const saved = await setDiscountsEnabled(enabled);
        return { enabled: saved };
    }
}
