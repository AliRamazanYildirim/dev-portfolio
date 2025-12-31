"use client";

import toast from "react-hot-toast";

type UseCustomerActionsParams = {
    customers: any[];
    validateForm: (customers: any[]) => boolean;
    getCustomerData: () => any;
    editingCustomer?: any | null;
    saveCustomer: (data: any, editing?: any | null) => Promise<any>;
    fetchCustomers: (opts?: any) => Promise<any[]>;
    setSelectedCustomer: (c: any) => void;
    resetForm: () => void;
    setShowForm: (v: boolean) => void;
    setSidebarOpen: (v: boolean) => void;
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
}: UseCustomerActionsParams) {
    const save = async () => {
        if (!validateForm(customers)) return;

        try {
            const saved = await saveCustomer(getCustomerData(), editingCustomer);
            if (saved) {
                try {
                    const fresh = await fetchCustomers();
                    const savedId = (saved as any)?._id ? (saved as any)._id : (saved as any).id;
                    const newSel = fresh.find((c: any) => String(c.id || c._id) === String(savedId));
                    if (newSel) setSelectedCustomer(newSel);
                } catch (e) {
                    // ignore
                }

                setShowForm(false);
                setSidebarOpen(true);
                resetForm();
            }
        } catch (error: any) {
            toast.error(error?.message || "Registration failed");
        }
    };

    return { save } as const;
}

export default useCustomerActions;
