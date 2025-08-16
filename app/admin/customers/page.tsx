"use client";

import { useState, useEffect } from "react";
import NoiseBackground from "@/components/NoiseBackground";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import toast from "react-hot-toast";

// Kunden-Interface
interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  companyname: string;
  email: string;
  phone: string;
  address: string;
  reference: string;
}

export default function CustomersAdminPage() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Formular-Status
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");

  // Beim Laden der Seite Kunden abrufen
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Kunden abrufen
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      const result = await res.json();
      if (result.success) {
        setCustomers(result.data);
      } else {
        setCustomers([]);
      }
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Formular zurücksetzen
  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setCompanyname("");
    setEmail("");
    setPhone("");
    setAddress("");
    setReference("");
    setEditingCustomer(null);
    setShowForm(false);
  };

  // Kunde speichern
  const saveCustomer = async () => {
    // Validierung
    if (!firstname.trim() || !lastname.trim() || !email.trim()) {
      toast.error("First name, last name, and email are required!");
      return;
    }
    const customerData = {
      firstname,
      lastname,
      companyname,
      email,
      phone,
      address,
      reference,
    };
    const url = editingCustomer
      ? `/api/admin/customers/${editingCustomer.id}`
      : "/api/admin/customers";
    const method = editingCustomer ? "PUT" : "POST";
    try {
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
        return editingCustomer
          ? "The customer has been updated!"
          : "The customer has been saved!";
      })();
      await toast.promise(promise, {
        loading: editingCustomer ? "Updating..." : "Saving...",
        success: (msg) => (typeof msg === "string" ? msg : "Successful"),
        error: (e) =>
          e instanceof Error ? e.message : "The process has failed.",
      });
      fetchCustomers();
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Registration failed");
    }
  };

  // Kunde löschen
  const deleteCustomer = async (id: string) => {
    try {
      const promise = (async () => {
        const res = await fetch(`/api/admin/customers/${id}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json?.error || `HTTP ${res.status}`);
        }
        return "Müşteri silindi!";
      })();
      await toast.promise(promise, {
        loading: "Siliniyor...",
        success: (msg) => (typeof msg === "string" ? msg : "Deleted"),
        error: (e) => (e instanceof Error ? e.message : "Deletion failed"),
      });
      fetchCustomers();
    } catch (error: any) {
      toast.error(error?.message || "Deletion failed");
    }
  };

  // Kunde bearbeiten
  const editCustomer = (customer: Customer) => {
    setFirstname(customer.firstname);
    setLastname(customer.lastname);
    setCompanyname(customer.companyname);
    setEmail(customer.email);
    setPhone(customer.phone);
    setAddress(customer.address);
    setReference(customer.reference);
    setEditingCustomer(customer);
    setShowForm(true);
  };

  // Authentifizierung wird überprüft
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
  // Nicht authentifiziert
  if (!isAuthenticated) return null;

  return (
    <main className="relative flex justify-center items-center flex-col overflow-x-hidden mx-auto">
      <div className="w-full">
        <NoiseBackground mode="dark" intensity={0.1}>
          <div className="relative z-10">
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
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 sm:gap-4">
                  <a
                    href="/admin"
                    className="button bg-[#131313] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#232323] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto font-bold text-sm flex items-center justify-center gap-2 mr-0 sm:mr-auto"
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Admin Panel
                  </a>
                  <button
                    onClick={() => setShowForm(true)}
                    className="button bg-white text-[#131313] px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
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
          <div className="relative z-10 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              {loading ? (
                <div className="flex items-center justify-center py-16 sm:py-24">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="grid gap-6 sm:gap-8">
                  {customers && customers.length > 0 ? (
                    customers.map((customer) => (
                      <div key={customer.id} className="group">
                        <div className="bg-[#eeede9] rounded-xl sm:rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] p-4 sm:p-6 lg:p-8 relative">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#131313] break-words">
                                  {customer.firstname} {customer.lastname}
                                </h3>
                                <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-[#c9184a] text-white self-start">
                                  {customer.companyname}
                                </span>
                              </div>
                              <p className="text-base sm:text-lg text-[#131313]/80 mb-4 sm:mb-6 leading-relaxed">
                                {customer.email} | {customer.phone}
                              </p>
                              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <span className="inline-flex items-center px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#131313]/10 text-[#131313] border border-[#131313]/20">
                                  {customer.address}
                                </span>
                                <span className="inline-flex items-center px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#131313]/10 text-[#131313] border border-[#131313]/20">
                                  {customer.reference}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:flex-row lg:absolute lg:bottom-6 lg:right-6">
                            <button
                              onClick={() => editCustomer(customer)}
                              className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 text-sm sm:text-base"
                            >
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCustomer(customer.id)}
                              className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 text-sm sm:text-base"
                            >
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 sm:py-24">
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
        </NoiseBackground>
      </div>
      {/* Modal-Formular */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="relative backdrop-blur-xl bg-white/95 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#131313] to-[#131313]/90 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="heading text-lg sm:text-xl lg:text-2xl text-white">
                    {editingCustomer ? "Editing customers" : "Add new customer"}
                  </h2>
                  <p className="content text-white/70 text-xs sm:text-sm mt-1 hidden sm:block">
                    Fill in the customer data
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-180px)]">
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Name..."
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="Last name..."
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Company name
                    </label>
                    <input
                      type="text"
                      placeholder="Company name..."
                      value={companyname}
                      onChange={(e) => setCompanyname(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Telefon
                    </label>
                    <input
                      type="text"
                      placeholder="Telefon..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Reference
                    </label>
                    <input
                      type="text"
                      placeholder="Reference..."
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#131313]/5 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-[#131313]/10 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end -mt-3">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#131313]/30 text-[#131313] rounded-xl font-medium hover:bg-[#131313]/5 transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomer}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#131313] hover:bg-[#131313]/90 text-white rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-sm sm:text-base order-1 sm:order-2"
              >
                {editingCustomer ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
