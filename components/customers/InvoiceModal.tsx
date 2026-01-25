"use client";

import { useState, useEffect, useMemo } from "react";
import { Customer } from "@/services/customerService";
import { INVOICE_CONSTANTS } from "@/constants/invoice";
import { InvoiceService } from "@/services/invoiceService";
import toast from "react-hot-toast";

// 3-stage discount calculation (3-6-9% + 3% bonus each additional referral)
function calcDiscountedPrice(
  originalPrice: number,
  referralCount: number,
): number {
  if (!referralCount || referralCount <= 0) {
    return Math.round(originalPrice * 100) / 100;
  }

  // Apply repeated 3% steps on the running subtotal, rounding cents each step.
  let currentPrice = Math.round(originalPrice * 100) / 100;
  for (let i = 0; i < referralCount; i += 1) {
    const discountCents = Math.round(currentPrice * 0.03 * 100);
    const discount = discountCents / 100;
    currentPrice = Math.round((currentPrice - discount) * 100) / 100;
  }

  return currentPrice;
}

interface InvoiceModalProps {
  show: boolean;
  customer: Customer | null;
  onClose: () => void;
}

interface InvoiceFormData {
  category: string;
  deliverables: string[];
  projectTitle: string;
  projectDescription: string;
  duration: string;
}

export default function InvoiceModal({
  show,
  customer,
  onClose,
}: InvoiceModalProps) {
  // Mirror sidebar behaviour used in admin pages: collapse sidebar on modal open
  const setSidebarOpenState = (open: boolean) => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    window.dispatchEvent(
      new CustomEvent("admin-sidebar:set", { detail: { open } }),
    );
  };

  useEffect(() => {
    if (show) {
      setSidebarOpenState(false);
    } else {
      setSidebarOpenState(true);
    }

    // Ensure sidebar restored if component unmounts
    return () => setSidebarOpenState(true);
  }, [show]);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>({
    category: INVOICE_CONSTANTS.PROJECT.DEFAULT_CATEGORY[0],
    deliverables: [],
    projectTitle: INVOICE_CONSTANTS.PROJECT.DEFAULT_TITLE,
    projectDescription: INVOICE_CONSTANTS.PROJECT.DEFAULT_DESCRIPTION,
    duration: INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION[0],
  });

  if (!show || !customer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.deliverables.length === 0) {
      toast.error("Please select at least one deliverable");
      return;
    }

    setSending(true);

    try {
      // Create invoice data
      const invoiceData = InvoiceService.createInvoiceData(customer, {
        category: formData.category,
        deliverables: formData.deliverables,
        title: formData.projectTitle,
        description: formData.projectDescription,
        duration: formData.duration,
      });

      // Call our email API
      const response = await fetch("/api/invoice/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceData,
          customerEmail: customer.email,
          customerName: `${customer.firstname} ${customer.lastname}`,
          customerId: (customer as any).id || (customer as any)._id,
          referrerCode: customer.myReferralCode ?? null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to send invoice email");
      }

      // Success! Show success message
      toast.success(`Invoice with PDF sent successfully to ${customer.email}!`);

      // Show PDF download option
      setTimeout(() => {
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium text-slate-800">
                  Download PDF Invoice?
                </p>
                <p className="text-sm text-slate-600">
                  Click to download a copy of the invoice
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    toast.dismiss(t.id);
                    try {
                      toast.loading("Generating PDF...", {
                        id: "pdf-download",
                      });

                      const pdfResponse = await fetch("/api/invoice/generate", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(invoiceData),
                      });

                      if (pdfResponse.ok) {
                        const blob = await pdfResponse.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `invoice-${invoiceData.invoiceNumber}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);

                        toast.success("PDF downloaded successfully!", {
                          id: "pdf-download",
                        });
                      } else {
                        toast.error("Failed to generate PDF", {
                          id: "pdf-download",
                        });
                      }
                    } catch (error) {
                      toast.error("Failed to download PDF", {
                        id: "pdf-download",
                      });
                    }
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          ),
          {
            duration: Infinity,
            style: {
              maxWidth: "500px",
            },
          },
        );
      }, 1000);

      // Close modal after success
      onClose();

      // Reset form
      setFormData({
        category: INVOICE_CONSTANTS.PROJECT.DEFAULT_CATEGORY[0],
        deliverables: [],
        projectTitle: INVOICE_CONSTANTS.PROJECT.DEFAULT_TITLE,
        projectDescription: INVOICE_CONSTANTS.PROJECT.DEFAULT_DESCRIPTION,
        duration: INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION[0],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send invoice. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="relative backdrop-blur-xl bg-white/95 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl text-white font-bold">
                Create Invoice
              </h2>
              <p className="text-white/70 text-xs sm:text-sm mt-1">
                Generate professional invoice for {customer.firstname}{" "}
                {customer.lastname}
              </p>
            </div>
            <button
              onClick={onClose}
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

        {/* Form Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto max-h-[calc(95vh-300px)] sm:max-h-[calc(90vh-280px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 border border-slate-200/50">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-semibold text-slate-600 mb-1">
                    Name:
                  </span>
                  <p className="text-slate-800 font-medium">
                    {customer.firstname} {customer.lastname}
                  </p>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-600 mb-1">
                    Company:
                  </span>
                  <p className="text-slate-800 font-medium">
                    {customer.companyname}
                  </p>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-600 mb-1">
                    Email:
                  </span>
                  <p className="text-slate-800 font-medium text-sm">
                    {customer.email}
                  </p>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-600 mb-1">
                    Original Price:
                  </span>
                  <p className="text-slate-600 font-medium">
                    €{(customer.price ?? 0).toFixed(2)}
                  </p>
                </div>
                {(customer.referralCount ?? 0) > 0 && (
                  <div>
                    <span className="block text-sm font-semibold text-slate-600 mb-1">
                      Discount ({customer.referralCount} referral
                      {(customer.referralCount ?? 0) > 1 ? "s" : ""} × 3%):
                    </span>
                    <p className="text-green-600 font-medium">
                      -€
                      {(
                        (customer.price ?? 0) -
                        calcDiscountedPrice(
                          customer.price ?? 0,
                          customer.referralCount ?? 0,
                        )
                      ).toFixed(2)}
                    </p>
                  </div>
                )}
                <div>
                  <span className="block text-sm font-semibold text-slate-600 mb-1">
                    Net Amount (after discount):
                  </span>
                  <p className="text-slate-800 font-bold text-lg">
                    €
                    {calcDiscountedPrice(
                      customer.price ?? 0,
                      customer.referralCount ?? 0,
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                Project Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        projectTitle: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        projectDescription: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                    placeholder="Enter project description"
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200/50">
              <h3 className="text-lg font-bold text-emerald-900 mb-4">
                Category Selection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INVOICE_CONSTANTS.PROJECT.DEFAULT_CATEGORY.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={formData.category === category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="text-slate-700 font-medium group-hover:text-emerald-700 transition-colors text-sm">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
              <h3 className="text-lg font-bold text-amber-900 mb-4">
                Project Duration
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION.map((duration) => (
                  <label
                    key={duration}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={duration}
                      checked={formData.duration === duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 focus:ring-2"
                    />
                    <span className="text-slate-700 font-medium group-hover:text-amber-700 transition-colors text-sm">
                      {duration}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deliverables Selection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200/50">
              <h3 className="text-lg font-bold text-purple-900 mb-4">
                Deliverables Selection
              </h3>
              <p className="text-sm text-purple-700 mb-4">
                Select all items that will be delivered:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {INVOICE_CONSTANTS.PROJECT.DEFAULT_DELIVERABLES.map(
                  (deliverable) => (
                    <label
                      key={deliverable}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        value={deliverable}
                        checked={formData.deliverables.includes(deliverable)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              deliverables: [...prev.deliverables, deliverable],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              deliverables: prev.deliverables.filter(
                                (d) => d !== deliverable,
                              ),
                            }));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2 rounded"
                      />
                      <span className="text-slate-700 font-medium group-hover:text-purple-700 transition-colors text-sm">
                        {deliverable}
                      </span>
                    </label>
                  ),
                )}
              </div>

              {formData.deliverables.length > 0 && (
                <div className="mt-3 p-3 bg-purple-100 rounded-xl">
                  <p className="text-sm text-purple-800 font-semibold">
                    Selected: {formData.deliverables.length} deliverable(s)
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-50 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-slate-200/50 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={sending || formData.deliverables.length === 0}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-sm sm:text-base order-1 sm:order-2"
          >
            {sending ? "Sending Invoice..." : "Generate & Send Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}
