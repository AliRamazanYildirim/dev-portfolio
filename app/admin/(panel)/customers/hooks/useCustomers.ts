import { useState, useEffect } from "react";
import { customerService } from "../services/customerService";
import type { Customer, FetchCustomersOptions } from "@/types/customer";
import { usePagination } from "@/hooks/usePagination";
import toast from "react-hot-toast";

export const useCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    // Page creation hook
    const pagination = usePagination({
        totalItems: customers.length,
        itemsPerPage: 10,
        initialPage: 1,
    });

    const fetchCustomers = async (opts?: FetchCustomersOptions) => {
        setLoading(true);
        try {
            const data = await customerService.fetchCustomers(opts);
            // Normalize Mongo documents that may include `_id` instead of `id`
            const normalized = data.map((c: any) => (c._id ? { ...c, id: c._id } : c));
            setCustomers(normalized);

            setSelectedCustomer((prev) => {
                if (!normalized.length) {
                    return null;
                }

                if (prev) {
                    const prevId = String((prev as any).id || (prev as any)._id || "");
                    const updated = normalized.find((customer: any) => {
                        const currentId = String(customer.id || customer._id || "");
                        return prevId && currentId === prevId;
                    });
                    if (updated) {
                        return updated;
                    }
                }

                return normalized[0];
            });

            return normalized;
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = async (filterValue?: string) => {
        const filterMap: { [key: string]: string } = {
            price_desc: "price.desc",
            price_asc: "price.asc",
            name_asc: "name.asc",
            name_desc: "name.desc",
            created_asc: "created.asc",
            created_desc: "created.desc",
        };

        let result: Customer[];
        if (!filterValue || filterValue === "none") {
            result = await fetchCustomers();
        } else if (filterMap[filterValue]) {
            result = await fetchCustomers({ sort: filterMap[filterValue] });
        } else {
            result = await fetchCustomers();
        }

        // Force select first item from sorted list
        if (result.length > 0) {
            setSelectedCustomer(result[0]);
        }

        return result;
    };

    const saveCustomer = async (
        customerData: Partial<Customer>,
        editingCustomer?: Customer | null
    ) => {
        const promise = customerService.saveCustomer(customerData, editingCustomer);

        const saved = await toast.promise(promise, {
            loading: editingCustomer ? "Updating..." : "Saving...",
            success: editingCustomer
                ? "The customer has been updated!"
                : "The customer has been saved!",
            error: (e) => {
                const msg = e instanceof Error ? e.message : "The process has failed.";
                const lower = msg.toLowerCase();
                if (
                    lower.includes("duplicate") ||
                    lower.includes("e11000") ||
                    lower.includes("email_1")
                ) {
                    return "A customer with this email already exists.";
                }
                return msg;
            },
        });

        if (saved) {
            await fetchCustomers();
        }
        return saved;
    };

    const deleteCustomer = async (id: string) => {
        await toast.promise(customerService.deleteCustomer(id), {
            loading: "Will be deleted...",
            success: "Customer has been deleted!",
            error: (e) => (e instanceof Error ? e.message : "Deletion failed"),
        });
        fetchCustomers();
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Berechnete paginierte Kunden - Verwenden Sie die paginatedData-Funktion im usePagination-Hook
    const currentCustomers = pagination.paginatedData(customers);

    useEffect(() => {
        // Wenn die Seite gewechselt oder Kunden geladen werden, wähle den ersten Kunden auf der aktuellen Seite aus.
        if (currentCustomers.length > 0) {
            // Wenn der ausgewählte Kunde nicht auf der aktuellen Seite ist, wähle den ersten Kunden auf der Seite aus.
            const isSelectedCustomerInCurrentPage =
                selectedCustomer &&
                currentCustomers.some(
                    (customer) => customer.id === selectedCustomer.id
                );

            if (!isSelectedCustomerInCurrentPage) {
                setSelectedCustomer(currentCustomers[0]);
            }
        } else if (customers.length === 0) {
            setSelectedCustomer(null);
        }
    }, [currentCustomers, customers.length, selectedCustomer]);

    return {
        customers,
        currentCustomers,
        selectedCustomer,
        setSelectedCustomer,
        loading,
        fetchCustomers,
        applyFilter,
        saveCustomer,
        deleteCustomer,
        pagination,
    };
};
