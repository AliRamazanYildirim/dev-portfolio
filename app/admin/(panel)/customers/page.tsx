"use client";

import { useState } from "react";
import NoiseBackground from "@/components/NoiseBackground";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomerForm } from "@/hooks/useCustomerForm";
import useAdminSidebar from "@/hooks/useAdminSidebar";
import CustomerList from "@/components/customers/CustomerList";
import CustomerDetails from "@/components/customers/CustomerDetails";
import CustomerForm from "@/components/customers/CustomerForm";
import toast from "react-hot-toast";
import { RefreshCcw, Search } from "lucide-react";
import FilterDropdown from "./components/FilterDropdown";
import { useCustomerSearch } from "./hooks/useCustomerSearch";

export default function CustomersAdminPage() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const {
    customers,
    currentCustomers,
    selectedCustomer,
    setSelectedCustomer,
    loading,
    fetchCustomers,
    saveCustomer,
    deleteCustomer,
    pagination,
  } = useCustomers();

  const {
    formData,
    updateField,
    editingCustomer,
    referralValidation,
    validateForm,
    getCustomerData,
    resetForm,
    setEditForm,
  } = useCustomerForm();

  const [showForm, setShowForm] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [filter, setFilter] = useState<
    | "none"
    | "price_desc"
    | "price_asc"
    | "name_asc"
    | "name_desc"
    | "created_asc"
    | "created_desc"
    | "date_range"
  >("none");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const {
    searchQuery,
    setSearchQuery,
    liveResults,
    showDropdown,
    setShowDropdown,
    onSearchInputChange,
  } = useCustomerSearch();

  const { setOpen: setSidebarOpen } = useAdminSidebar();

  const handleSaveCustomer = async () => {
    if (!validateForm(customers)) return;

    try {
      const saved = await saveCustomer(getCustomerData(), editingCustomer);
      // If saved is truthy, refresh list from server and select the saved customer
      if (saved) {
        let newSel: any = null;
        try {
          const fresh = await fetchCustomers();
          // find the freshly saved customer in the returned list
          const savedId = (saved as any)._id
            ? (saved as any)._id
            : (saved as any).id;
          newSel = fresh.find(
            (c: any) => String(c.id || c._id) === String(savedId)
          );
          if (newSel) setSelectedCustomer(newSel);
        } catch (e) {
          // ignore fetch errors here
        }

        // Referral email / notification is handled inside `customerService.saveCustomer`.
        setShowForm(false);
        setSidebarOpen(true);
        resetForm();
      }
    } catch (error: any) {
      toast.error(error?.message || "Registration failed");
    }
  };

  const handleEditCustomer = (customer: any) => {
    setEditForm(customer);
    setSidebarOpen(false);
    setShowForm(true);
    setSelectedCustomer(customer);
  };

  // Do not mirror form changes into `selectedCustomer` on the client.
  // The selected customer will only change if the server confirms the save.

  const handleCancelForm = () => {
    setSidebarOpen(true);
    setShowForm(false);
    resetForm();
  };

  const handleFilterChange = (filterValue: string) => {
    setFilter(filterValue as any);

    const filterMap: { [key: string]: string } = {
      price_desc: "price.desc",
      price_asc: "price.asc",
      name_asc: "name.asc",
      name_desc: "name.desc",
      created_asc: "created.asc",
      created_desc: "created.desc",
    };

    if (filterMap[filterValue]) {
      fetchCustomers({ sort: filterMap[filterValue] });
    } else if (filterValue === "none") {
      fetchCustomers();
    }
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <NoiseBackground mode="dark" intensity={0.1}>
          <div className="relative z-10 flex items-center justify-center min-h-screen w-full h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Session is being verified...</p>
            </div>
          </div>
        </NoiseBackground>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen w-full">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }
      `}</style>
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="min-h-screen w-full">
          {/* Header Section */}
          <div className="relative z-10 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h1 className="title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-2">
                    Customer Management
                  </h1>
                  <p className="content text-base sm:text-lg text-white/70">
                    Manage customers
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center landscape:justify-end lg:justify-end gap-3 sm:gap-4">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowForm(true);
                    }}
                    className="bg-white text-[#131313] px-4 py-2 rounded-lg font-semibold shadow hover:shadow-md"
                  >
                    <span className="flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-base">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      New Customer
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              {/* Search and Filter */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-transparent sm:justify-end">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetchCustomers({ q: searchQuery });
                    }}
                    className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:items-center"
                  >
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-black/50" />
                      <input
                        type="search"
                        placeholder="Search name, company, address or reference..."
                        value={searchQuery}
                        onChange={(e) => onSearchInputChange(e.target.value)}
                        className="w-full bg-white/90 text-black pl-8 sm:pl-9 pr-3 py-1.5 rounded-md text-sm focus:outline-none"
                        onFocus={() => {
                          if (liveResults.length > 0) setShowDropdown(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => setShowDropdown(false), 150)
                        }
                      />

                      {showDropdown && liveResults.length > 0 && (
                        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto text-sm text-black">
                          {liveResults.map((c) => (
                            <li
                              key={c._id || c.id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onMouseDown={() => {
                                // select this customer
                                setSearchQuery(
                                  `${c.firstname || ""} ${
                                    c.lastname || ""
                                  }`.trim()
                                );
                                setSelectedCustomer(c);
                                setShowDropdown(false);
                              }}
                            >
                              <div className="font-semibold text-gray-900">
                                {c.firstname} {c.lastname}
                              </div>
                              <div className="text-gray-600">
                                {c.companyname || c.email || c.myReferralCode}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-row gap-2 w-full landscape:w-auto landscape:justify-end sm:w-auto">
                      <button
                        type="submit"
                        className="flex-1 landscape:flex-none sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-[#131313] px-3 py-1.5 rounded-md text-sm font-semibold"
                      >
                        <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Search</span>
                      </button>
                      <div className="relative flex-1 flex-shrink-0">
                        <FilterDropdown
                          value={filter}
                          onChange={(v) => handleFilterChange(v)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => fetchCustomers()}
                        className="flex-1 landscape:flex-none sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-[#131313] px-3 py-1.5 rounded-lg font-semibold shadow hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <RefreshCcw
                          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#131313] ${
                            loading ? "animate-spin" : ""
                          }`}
                        />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </form>
                </div>

                {filter === "date_range" && (
                  <div className="mt-2 flex flex-col items-end gap-2 bg-[#131313]/20 p-2 rounded-lg w-56 self-end ml-auto">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full bg-white/90 text-black px-2 py-1 rounded-md text-sm"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full bg-white/90 text-black px-2 py-1 rounded-md text-sm"
                    />
                    <button
                      onClick={() => {
                        if (!dateFrom || !dateTo) {
                          toast.error("Please select both dates");
                          return;
                        }
                        fetchCustomers({ from: dateFrom, to: dateTo });
                      }}
                      className="w-full bg-white text-[#131313] px-2 py-1 rounded-md text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white"></div>
                  <p className="text-white/80 mt-4">Loading customers...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-280px)]">
                  {customers && customers.length > 0 ? (
                    <>
                      <CustomerList
                        currentCustomers={currentCustomers}
                        allCustomers={customers}
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={(customer) => {
                          setSelectedCustomer(customer);
                          // Open modal on mobile when customer is selected
                          if (window.innerWidth < 1024) {
                            setShowMobileDetails(true);
                          }
                        }}
                        pagination={pagination}
                      />
                      {/* Desktop: Show inline */}
                      <div className="hidden lg:block lg:col-span-8 xl:col-span-9">
                        <CustomerDetails
                          customer={selectedCustomer}
                          onEdit={handleEditCustomer}
                          onDelete={deleteCustomer}
                        />
                      </div>
                      {/* Mobile: Show as modal */}
                      {showMobileDetails && (
                        <CustomerDetails
                          customer={selectedCustomer}
                          onEdit={(customer) => {
                            setShowMobileDetails(false);
                            handleEditCustomer(customer);
                          }}
                          onDelete={(id) => {
                            setShowMobileDetails(false);
                            deleteCustomer(id);
                          }}
                          isModal={true}
                          onClose={() => setShowMobileDetails(false)}
                        />
                      )}
                    </>
                  ) : (
                    <div className="col-span-12 text-center py-16 sm:py-24">
                      <div className="bg-[#eeede9] rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-8 sm:p-12 max-w-sm sm:max-w-md mx-auto">
                        <svg
                          className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-[#131313]/50 mb-4 sm:mb-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 48 48"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0122 34c4.09 0 7.691 2.462 9.287 6M6 16a6 6 0 0112 0v3.586l.707.707c.63.63.293 1.707-.707 1.707H6z"
                          />
                        </svg>
                        <h3 className="text-lg sm:text-xl font-medium text-[#131313] mb-2 sm:mb-3">
                          No customers yet.
                        </h3>
                        <p className="text-sm sm:text-base text-[#131313]/70">
                          Click the button above to add your first customer.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <CustomerForm
            show={showForm}
            formData={formData}
            editingCustomer={editingCustomer}
            referralValidation={referralValidation}
            onUpdateField={updateField}
            onSave={handleSaveCustomer}
            onCancel={handleCancelForm}
          />
        </div>
      </NoiseBackground>
    </div>
  );
}
