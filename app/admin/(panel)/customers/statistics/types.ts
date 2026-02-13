/**
 * Re-export from the single source of truth.
 * @see types/customer.ts
 */
import type { Customer } from "@/types/customer";
export type { Customer };

export interface StatsSnapshot {
    total: number;
    revenue: number;
    avg: number;
    days: string[];
    counts: number[];
    topCustomers: Customer[];
}
