import { useState, useEffect } from "react";
import {
  customerService,
  Customer,
  FetchCustomersOptions,
} from "@/services/customerService";
import { usePagination } from "./usePagination";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Page creation hook
  const pagination = usePagination({
    totalItems: customers.length,
    itemsPerPage: 8,
    initialPage: 1,
  });

  const fetchCustomers = async (opts?: FetchCustomersOptions) => {
    setLoading(true);
    const data = await customerService.fetchCustomers(opts);
    // Normalize Mongo documents that may include `_id` instead of `id`
    const normalized = data.map((c: any) => (c._id ? { ...c, id: c._id } : c));
    setCustomers(normalized);
    setLoading(false);
    return normalized;
  };

  const saveCustomer = async (
    customerData: Partial<Customer>,
    editingCustomer?: Customer | null
  ) => {
    const saved = await customerService.saveCustomer(
      customerData,
      editingCustomer
    );
    // Refresh list only when server returned a saved customer
    if (saved) {
      await fetchCustomers();
    }
    return saved;
  };

  const deleteCustomer = async (id: string) => {
    await customerService.deleteCustomer(id);
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
    saveCustomer,
    deleteCustomer,
    pagination,
  };
};
