/**
 * Admin Customers API – Types & Interfaces
 */

export interface CreateCustomerRequest {
    firstname?: string;
    lastname?: string;
    companyname?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string | null;
    postcode?: string | null;
    reference?: string | null;
    price: number;
    language?: string;
    createdAt?: string;
}

export interface CustomerQueryParams {
    sort?: string | null;
    from?: string | null;
    to?: string | null;
    q?: string | null;
}
