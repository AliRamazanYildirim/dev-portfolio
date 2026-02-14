import type { Customer, FetchCustomersOptions } from "@/types/customer";

export type { Customer, FetchCustomersOptions };

export const customerService = {
    async fetchCustomers(opts?: FetchCustomersOptions): Promise<Customer[]> {
        try {
            let url = "/api/admin/customers";
            const params = new URLSearchParams();
            if (opts?.sort) params.set("sort", opts.sort);
            if (opts?.from) params.set("from", opts.from);
            if (opts?.to) params.set("to", opts.to);
            if (opts?.q) params.set("q", opts.q);
            const qs = params.toString();
            if (qs) url += `?${qs}`;

            const res = await fetch(url);
            const result = await res.json();
            return result.success ? result.data : [];
        } catch {
            return [];
        }
    },

    async saveCustomer(
        customerData: Partial<Customer>,
        editingCustomer?: Customer | null
    ): Promise<Customer | null> {
        const url =
            editingCustomer && (editingCustomer as any).id
                ? `/api/admin/customers/${(editingCustomer as any).id}`
                : "/api/admin/customers";
        const method = editingCustomer ? "PUT" : "POST";

        let savedCustomer: Customer | null = null;

        const promise = (async () => {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerData),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json?.error || `HTTP ${res.status}`);
            }

            // If server returned the created/updated customer, normalize it
            // server may return `_id` so map to `id` if necessary
            const data = json.data || null;
            if (data) {
                savedCustomer = data._id ? { ...data, id: data._id } : data;
            } else if (editingCustomer) {
                // Server didn't return the saved data on update — create a best-effort
                // returned object by merging the existing editingCustomer and the
                // provided customerData (this ensures callers can use an id/email)
                savedCustomer = {
                    ...(editingCustomer as any),
                    ...customerData,
                    id: (editingCustomer as any).id,
                } as Customer;
            }

            return savedCustomer;
        })();

        return await promise;
    },

    async deleteCustomer(id: string): Promise<void> {
        const res = await fetch(`/api/admin/customers/${id}`, {
            method: "DELETE",
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json?.error || `HTTP ${res.status}`);
        }
    },

    async validateReferralCode(code: string, basePrice: string) {
        if (!code.trim() || !basePrice.trim()) return null;

        try {
            const response = await fetch("/api/referral/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    referralCode: code.trim(),
                    basePrice: Number(basePrice),
                }),
            });

            const result = await response.json();

            if (result.success) {
                return {
                    isValid: true,
                    referrerName: result.data.referrer.name,
                    discount: result.data.discount,
                };
            } else {
                return { isValid: false, error: result.error };
            }
        } catch {
            return {
                isValid: false,
                error: "An error occurred while checking the reference code.",
            };
        }
    },

    async sendReferralEmail(
        customerId: string,
        customerEmail: string
    ): Promise<void> {
        const response = await fetch("/api/referral/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId, customerEmail }),
        });

        const result = await response.json();
        if (!result.success || !result.data) {
            throw new Error(result.error || "Email could not be sent");
        }
        return result.data;
    },
};
