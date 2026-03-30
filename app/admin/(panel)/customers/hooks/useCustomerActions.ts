"use client";

import toast from "react-hot-toast";
import type { Customer, FetchCustomersOptions } from "@/types/customer";

type UseCustomerActionsParams = {
    customers: Customer[];
    validateForm: (customers: Customer[]) => boolean;
    getCustomerData: () => Partial<Customer>;
    editingCustomer?: Customer | null;
    saveCustomer: (
        data: Partial<Customer>,
        editing?: Customer | null
    ) => Promise<Customer | null>;
    fetchCustomers: (opts?: FetchCustomersOptions) => Promise<Customer[]>;
    setSelectedCustomer: (customer: Customer | null) => void;
    resetForm: () => void;
    setShowForm: (visible: boolean) => void;
    setSidebarOpen: (visible: boolean) => void;
    setEditForm: (customer: Customer) => void;
    deleteCustomer: (id: string) => Promise<void>;
};

const resolveCustomerId = (customer: Partial<Customer> | null | undefined): string | null => {
    if (!customer) return null;
    if (typeof customer.id === "string" && customer.id.length > 0) return customer.id;
    if (typeof customer._id === "string" && customer._id.length > 0) return customer._id;
    return null;
};

export function useCustomerActions({
    customers,
    validateForm,
    getCustomerData,
    editingCustomer,
    saveCustomer,
    fetchCustomers,
    setSelectedCustomer,
    resetForm,
    setShowForm,
    setSidebarOpen,
    setEditForm,
    deleteCustomer,
}: UseCustomerActionsParams) {
    const save = async () => {
        if (!validateForm(customers)) return;

        try {
            const saved = await saveCustomer(getCustomerData(), editingCustomer);
            if (saved) {
                try {
                    const fresh = await fetchCustomers();
                    const savedId = resolveCustomerId(saved);
                    const newSel = savedId
                        ? fresh.find((customer) => resolveCustomerId(customer) === savedId)
                        : null;
                    if (newSel) setSelectedCustomer(newSel);
                } catch (e) {
                    // ignore
                }

                setShowForm(false);
                setSidebarOpen(true);
                resetForm();
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Registration failed";
            toast.error(errorMessage);
        }
    };

    const openEditForm = (customer: Customer) => {
        setEditForm(customer);
        setSidebarOpen(false);
        setShowForm(true);
        setSelectedCustomer(customer);
    };

    const cancelForm = () => {
        setSidebarOpen(true);
        setShowForm(false);
        resetForm();
    };

    const remove = async (id: string) => {
        await deleteCustomer(id);
    };

    return { save, openEditForm, cancelForm, remove } as const;
}

export default useCustomerActions;
