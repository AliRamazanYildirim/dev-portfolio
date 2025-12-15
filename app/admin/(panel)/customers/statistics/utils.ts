import { Customer, StatsSnapshot } from "./types";

export function formatMoney(value: number) {
    return `€${value.toLocaleString()}`;
}

export function sparklinePath(values: number[], width = 240, height = 60) {
    if (!values || values.length === 0) return "M0,30 L240,30";
    if (values.length === 1) {
        return `M0,${height / 2} L${width},${height / 2}`;
    }

    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || Math.max(1, max * 0.1);
    const step = width / Math.max(1, values.length - 1);

    return values
        .map((v, index) => {
            const x = Math.round(index * step);
            const normalizedY = range > 0 ? (v - min) / range : 0.5;
            const y = Math.round(height * 0.1 + normalizedY * height * 0.8);
            return `${index === 0 ? "M" : "L"}${x},${y}`;
        })
        .join(" ");
}

export function normalizeCustomers(data: any[]): Customer[] {
    return (data || []).map((c) => ({
        ...c,
        id: c.id ?? c._id ?? (c._id ? String(c._id) : undefined),
    }));
}

export function computeStats(customers: Customer[], rangeDays: number): StatsSnapshot {
    const total = customers.length;
    const revenue = customers.reduce((sum, customer) => sum + (customer.price || 0), 0);
    const avg = total > 0 ? revenue / total : 0;

    const days = Array.from({ length: rangeDays }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (rangeDays - 1 - i));
        return date.toISOString().slice(0, 10);
    });

    const countsMap: Record<string, number> = {};
    customers.forEach((customer) => {
        const dateValue = customer.createdAt || customer.created_at;
        if (!dateValue) return;

        let dateKey = "";
        try {
            const parsed = new Date(dateValue);
            if (!Number.isNaN(parsed.getTime())) {
                dateKey = parsed.toISOString().slice(0, 10);
            }
        } catch (error) {
            if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
                dateKey = dateValue.slice(0, 10);
            }
        }

        if (dateKey) {
            countsMap[dateKey] = (countsMap[dateKey] || 0) + 1;
        }
    });

    let counts = days.map((day) => countsMap[day] || 0);
    const totalInRange = counts.reduce((acc, value) => acc + value, 0);

    if (totalInRange === 0 && Object.keys(countsMap).length > 0) {
        const allDates = Object.keys(countsMap).sort();
        const earliestDate = allDates[0];
        const latestDate = allDates[allDates.length - 1];

        const start = new Date(earliestDate);
        const end = new Date(latestDate);
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const newDays = Array.from({ length: daysDiff }).map((_, index) => {
            const date = new Date(start);
            date.setDate(date.getDate() + index);
            return date.toISOString().slice(0, 10);
        });

        counts = newDays.map((day) => countsMap[day] || 0);

        return buildSnapshot(customers, newDays, counts, revenue, total, avg);
    }

    return buildSnapshot(customers, days, counts, revenue, total, avg);
}

function buildSnapshot(
    customers: Customer[],
    days: string[],
    counts: number[],
    revenue: number,
    total: number,
    avg: number
): StatsSnapshot {
    const topCustomers = [...customers]
        .filter((customer) => typeof customer.price === "number")
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 3);

    return {
        total,
        revenue,
        avg,
        days,
        counts,
        topCustomers,
    };
}
