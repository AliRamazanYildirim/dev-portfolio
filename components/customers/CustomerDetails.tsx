import { Customer, customerService } from "@/services/customerService";
import NoiseBackground from "@/components/NoiseBackground";
import { useInvoiceGenerator } from "@/hooks/useInvoiceGenerator";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import InvoiceModal from "./InvoiceModal";

interface CustomerDetailsProps {
  customer: Customer | null;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export default function CustomerDetails({
  customer,
  onEdit,
  onDelete,
}: CustomerDetailsProps) {
  const { isGenerating, generateInvoice } = useInvoiceGenerator();
  const router = useRouter();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [projectStatus, setProjectStatus] = useState<
    "gestart" | "in-vorbereitung" | "abgeschlossen"
  >(() => customer?.projectStatus ?? "gestart");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Keep local projectStatus in sync when a different customer is selected
  useEffect(() => {
    setProjectStatus(customer?.projectStatus ?? "gestart");
  }, [customer?.id]);

  if (!customer) {
    return (
      <div className="lg:col-span-8 xl:col-span-9">
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 h-full flex items-center justify-center">
          <NoiseBackground mode="light" intensity={0.1}>
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">
                No Customer Selected
              </h3>
              <p className="text-slate-500">
                Select a customer from the list to view details
              </p>
            </div>
          </NoiseBackground>
        </div>
      </div>
    );
  }

  const handleCopyReferral = async () => {
    if (customer.myReferralCode) {
      navigator.clipboard.writeText(customer.myReferralCode);
      toast.success("Reference code copied: " + customer.myReferralCode);
    } else {
      toast.error("Reference code not found");
    }
  };

  const handleGenerateInvoice = () => {
    // Modal'ı aç
    setShowInvoiceModal(true);
  };

  return (
    <div className="lg:col-span-8 xl:col-span-9">
      <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden flex flex-col">
        <NoiseBackground mode="light" intensity={0.1}>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Customer Details</h2>
                <p className="text-white/70">
                  Complete information and actions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-2xl shadow-lg">
                  {customer.firstname.charAt(0)}
                  {customer.lastname.charAt(0)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl p-6 border border-slate-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        Full Name
                      </label>
                      <p className="text-xl font-bold text-slate-800">
                        {customer.firstname} {customer.lastname}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        Company
                      </label>
                      <p className="text-lg text-slate-700">
                        {customer.companyname}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="text-lg text-slate-700 break-all">
                        {customer.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        Phone
                      </label>
                      <p className="text-lg text-slate-700">{customer.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Progress Panel (admin only editable) */}
              <div className="bg-gradient-to-r from-white/95 to-white/90 rounded-3xl p-6 border border-slate-200/40">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Project Progress
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-4 items-start">
                  {[
                    {
                      key: "gestart",
                      label: "Gestart",
                      color: "bg-blue-500",
                      percent: "33%",
                    },
                    {
                      key: "in-vorbereitung",
                      label: "In Vorbereitung",
                      color: "bg-amber-400",
                      percent: "66%",
                    },
                    {
                      key: "abgeschlossen",
                      label: "Abgeschlossen",
                      color: "bg-emerald-500",
                      percent: "100%",
                    },
                  ].map((step) => {
                    const key = step.key as
                      | "gestart"
                      | "in-vorbereitung"
                      | "abgeschlossen";
                    const doneOrder =
                      projectStatus === "gestart"
                        ? 0
                        : projectStatus === "in-vorbereitung"
                        ? 1
                        : 2;
                    const stepOrder =
                      key === "gestart" ? 0 : key === "in-vorbereitung" ? 1 : 2;
                    const done = stepOrder < doneOrder;
                    const active = stepOrder === doneOrder;

                    const showDash = !done && !active && doneOrder >= 0;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center text-center"
                      >
                        <button
                          aria-pressed={active}
                          aria-label={`Set status to ${step.label}`}
                          disabled={updatingStatus}
                          onClick={async () => {
                            // Allow clicking the active step when it's the initial 'gestart' state
                            // so the admin can re-send the project-status email even if the
                            // status hasn't changed. For other statuses, keep early-return.
                            if (key === projectStatus && key !== "gestart")
                              return;
                            setUpdatingStatus(true);
                            try {
                              // quick admin session check
                              const session = await fetch("/api/admin/session");
                              if (!session.ok) {
                                toast.error(
                                  "Admin login required to change status"
                                );
                                setUpdatingStatus(false);
                                return;
                              }

                              // save to server and get result
                              const saved = await customerService.saveCustomer(
                                { projectStatus: key },
                                customer
                              );
                              if (!saved) throw new Error("Save failed");

                              // send notification email (admin-only route)
                              const mailRes = await fetch(
                                "/api/project-status-email",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  credentials: "include",
                                  body: JSON.stringify({
                                    clientName: `${customer?.firstname ?? ""} ${
                                      customer?.lastname ?? ""
                                    }`.trim(),
                                    clientEmail: customer?.email ?? "",
                                    projectTitle:
                                      customer?.companyname ||
                                      `${customer?.firstname ?? ""} ${
                                        customer?.lastname ?? ""
                                      }`,
                                    status: key,
                                    message: `Der Status Ihres Projekts wurde auf "${step.label}" gesetzt.`,
                                    projectImage:
                                      (customer as any)?.logo || undefined,
                                    ctaUrl:
                                      process.env.NEXT_PUBLIC_SITE_URL ||
                                      undefined,
                                  }),
                                }
                              );

                              const mailJson = await mailRes
                                .json()
                                .catch(() => ({ success: false }));
                              if (!mailRes.ok || !mailJson.success) {
                                console.error("Mail send failed", mailJson);
                                setProjectStatus(key);
                                toast(
                                  mailJson?.error ||
                                    "Status updated but could not notify customer",
                                  { icon: "⚠️" }
                                );
                              } else {
                                setProjectStatus(key);
                                toast.success(
                                  "Status updated and customer notified"
                                );
                              }
                            } catch (err) {
                              console.error(err);
                              const msg = (err as any)?.message || String(err);
                              // If the service already showed a friendly duplicate-key message,
                              // avoid showing a second generic toast. Show generic only for other errors.
                              if (
                                !/duplicate|e11000|email|already registered/i.test(
                                  msg
                                )
                              ) {
                                toast.error("Could not update status");
                              }
                            } finally {
                              setUpdatingStatus(false);
                            }
                          }}
                          className={`inline-flex items-center justify-center w-20 h-20 rounded-full shadow-md transform transition-all duration-200 ${
                            active
                              ? `${step.color} text-white scale-100 ring-4 ring-white/20`
                              : done
                              ? "bg-white text-slate-900 border border-slate-200"
                              : "bg-white text-slate-500 border border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-center w-full h-full">
                            {done ? (
                              <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : active ? (
                              <span className="text-sm font-bold">
                                {(step as any).percent}
                              </span>
                            ) : showDash ? (
                              <svg
                                className="w-4 h-4 text-slate-900"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                              >
                                <line
                                  x1="6"
                                  y1="12"
                                  x2="18"
                                  y2="12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              <span className="text-sm font-semibold">
                                &nbsp;
                              </span>
                            )}
                          </div>
                        </button>

                        <div
                          className="mt-3 text-sm font-semibold"
                          style={{
                            color: active
                              ? undefined
                              : done
                              ? "#0f172a"
                              : "#64748b",
                          }}
                        >
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-slate-500 mt-3">
                  You can update the project stage — the customer will receive
                  an email notification.
                </p>
              </div>

              {/* Pricing Information */}
              {customer.price && (
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-emerald-800">
                      Pricing Information
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {customer.finalPrice != null && customer.discountRate ? (
                      <>
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                          <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Original Price
                          </label>
                          <p className="text-2xl font-bold text-red-600 line-through">
                            €{Number(customer.price).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                          <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Final Price
                          </label>
                          <p className="text-2xl font-bold text-emerald-600">
                            €{Number(customer.finalPrice).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                          <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            Discount
                          </label>
                          <p className="text-2xl font-bold text-blue-600">
                            {customer.discountRate}%
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                          Price
                        </label>
                        <p className="text-2xl font-bold text-emerald-600">
                          €{Number(customer.price).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location & References */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-blue-800">
                    Location & References
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 block">
                      Address
                    </label>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <p className="text-lg text-slate-700">
                        {customer.address}
                      </p>
                      {(customer.city || (customer as any).postcode) && (
                        <p className="text-sm text-slate-500 mt-2">
                          {customer.city ? `${customer.city}` : ""}
                          {customer.city && customer.postcode ? ", " : ""}
                          {customer.postcode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {customer.myReferralCode && (
                      <div>
                        <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 block">
                          Own Referral Code
                        </label>
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                          <p className="text-lg font-mono text-emerald-600">
                            {customer.myReferralCode}
                          </p>
                          <p className="text-sm text-slate-500">
                            {customer.referralCount || 0} people used this code
                          </p>
                        </div>
                      </div>
                    )}
                    {customer.reference && (
                      <div>
                        <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 block">
                          Used Referral Code
                        </label>
                        <div className="bg-white rounded-2xl p-4 shadow-lg">
                          <p className="text-lg font-mono text-amber-600">
                            {customer.reference}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-purple-800">
                    Actions
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={handleGenerateInvoice}
                    disabled={false}
                    className="w-full relative group/btn overflow-hidden inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-700 to-purple-800 text-white rounded-2xl font-bold shadow-lg hover:shadow-violet-500/40 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Create Invoice
                  </button>
                  <button
                    onClick={handleCopyReferral}
                    className="w-full relative group/btn overflow-hidden inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-blue-500/40 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Share Referral
                  </button>
                  {/* 'Send Email' button removed; server now sends referrer notification on create */}
                  <button
                    onClick={() => onEdit(customer)}
                    className="w-full relative group/btn overflow-hidden inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-orange-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-amber-500/40 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    onClick={() => {
                      toast(
                        (t) => (
                          <div className="flex flex-col gap-2 w-96">
                            <p className="font-semibold">Are you sure?</p>
                            <p className="text-sm text-gray-600">
                              This action cannot be undone.
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  toast.dismiss(t.id);
                                  onDelete(customer.id);
                                }}
                                className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => toast.dismiss(t.id)}
                                className="flex-1 bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-400 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ),
                        { duration: Infinity }
                      );
                    }}
                    className="w-full relative group/btn overflow-hidden inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-red-500/40 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
          </div>
        </NoiseBackground>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        show={showInvoiceModal}
        customer={customer}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
}
