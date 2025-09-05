import { useState, useEffect } from "react";
import {
  customerService,
  Customer,
  FetchCustomersOptions,
} from "@/services/customerService";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 9;

  const fetchCustomers = async (opts?: FetchCustomersOptions) => {
    setLoading(true);
    setCurrentPage(1);
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

  useEffect(() => {
    if (customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers, selectedCustomer]);

  return {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    loading,
    currentPage,
    setCurrentPage,
    customersPerPage,
    fetchCustomers,
    saveCustomer,
    deleteCustomer,
  };
};
