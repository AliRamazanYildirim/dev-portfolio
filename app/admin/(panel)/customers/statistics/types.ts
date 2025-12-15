export interface Customer {
    id: string;
    firstname: string;
    lastname: string;
    companyname: string;
    email: string;
    phone: string;
    address: string;
    reference: string;
    price?: number | null;
    createdAt?: string | null;
    created_at?: string | null;
}

export interface StatsSnapshot {
    total: number;
    revenue: number;
    avg: number;
    days: string[];
    counts: number[];
    topCustomers: Customer[];
}
