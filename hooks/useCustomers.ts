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

  // Pagination için hook
  const pagination = usePagination({
    totalItems: customers.length,
    itemsPerPage: 6,
    initialPage: 1,
  });

  const fetchCustomers = async (opts?: FetchCustomersOptions) => {
    setLoading(true);
    const data = await customerService.fetchCustomers(opts);
    setCustomers(data);
    setLoading(false);
  };

  const saveCustomer = async (
    customerData: Partial<Customer>,
    editingCustomer?: Customer | null
  ) => {
    await customerService.saveCustomer(customerData, editingCustomer);
    fetchCustomers();
  };

  const deleteCustomer = async (id: string) => {
    await customerService.deleteCustomer(id);
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Sayfalanmış müşterileri hesapla - usePagination hook'ündaki paginatedData fonksiyonunu kullan
  const currentCustomers = pagination.paginatedData(customers);

  // Debug için
  console.log("Pagination Debug:", {
    totalCustomers: customers.length,
    currentPage: pagination.currentPage,
    startIndex: pagination.startIndex,
    endIndex: pagination.endIndex,
    currentCustomersCount: currentCustomers.length,
    itemsPerPage: 6,
  });

  useEffect(() => {
    // Sayfa değiştiğinde veya müşteriler yüklendiğinde, mevcut sayfadaki ilk müşteriyi seç
    if (currentCustomers.length > 0) {
      // Eğer seçili müşteri mevcut sayfada değilse, sayfadaki ilk müşteriyi seç
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
