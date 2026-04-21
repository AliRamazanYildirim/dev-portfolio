"use client";

import { useState } from "react";
import { FileText, RefreshCcw, Search } from "lucide-react";

import NoiseBackground from "@/components/ui/NoiseBackground";

import { useAdminAuth } from "../hooks/useAdminAuth";
import useAdminSidebar from "../hooks/useAdminSidebar";
import { useCustomers } from "../customers/hooks/useCustomers";
import { useCustomerForm } from "../customers/hooks/useCustomerForm";
import { useCustomerSearch } from "../customers/hooks/useCustomerSearch";
import useCustomerActions from "../customers/hooks/useCustomerActions";
import CustomerList from "../customers/components/CustomerList";
import CustomerDetails from "../customers/components/CustomerDetails";
import CustomerForm from "../customers/components/CustomerForm";

export default function InvoiceManagementPage() {
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
  const { setOpen: setSidebarOpen } = useAdminSidebar();

  const { save, openEditForm, cancelForm, remove } = useCustomerActions({
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
  });

  const {
    searchQuery,
    setSearchQuery,
    liveResults,
    showDropdown,
    setShowDropdown,
    onSearchInputChange,
  } = useCustomerSearch();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchCustomers({ q: searchQuery });
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
          <div className="relative z-10 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h1 className="title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-2 flex items-center justify-center lg:justify-start gap-3">
                    <FileText className="h-8 w-8 sm:h-10 sm:w-10" />
                    Invoice Management
                  </h1>
                  <p className="content text-base sm:text-lg text-white/70">
                    Manage invoice creation with the existing Create Invoice
                    flow
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-transparent sm:justify-end">
                  <form
                    onSubmit={handleSearch}
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
                                setSearchQuery(
                                  `${c.firstname || ""} ${
                                    c.lastname || ""
                                  }`.trim(),
                                );
                                setSelectedCustomer(c);
                                if (window.innerWidth < 1024) {
                                  setShowMobileDetails(true);
                                }
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
                        className="flex-1 landscape:flex-none sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-[#131313] px-3 py-1.5 rounded-md text-sm font-semibold cursor-pointer"
                      >
                        <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Search</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          fetchCustomers();
                        }}
                        className="flex-1 landscape:flex-none sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-[#131313] px-3 py-1.5 rounded-lg font-semibold shadow hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                          if (window.innerWidth < 1024) {
                            setShowMobileDetails(true);
                          }
                        }}
                        pagination={pagination}
                      />

                      <div className="hidden lg:block lg:col-span-8 xl:col-span-9">
                        <CustomerDetails
                          customer={selectedCustomer}
                          onEdit={openEditForm}
                          onDelete={remove}
                          actionMode="invoice-manage"
                        />
                      </div>

                      {showMobileDetails && (
                        <CustomerDetails
                          customer={selectedCustomer}
                          onEdit={(customer) => {
                            setShowMobileDetails(false);
                            openEditForm(customer);
                          }}
                          onDelete={(id) => {
                            setShowMobileDetails(false);
                            remove(id);
                          }}
                          actionMode="invoice-manage"
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
                          Add customers in the customer section first.
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
            onSave={save}
            onCancel={cancelForm}
          />
        </div>
      </NoiseBackground>
    </div>
  );
}
