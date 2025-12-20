import { Customer } from "@/services/customerService";
import { useMemo, useState } from "react";

interface CustomerFormProps {
  show: boolean;
  formData: {
    firstname: string;
    lastname: string;
    companyname: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    postcode?: string;
    reference: string;
    price: string;
  };
  editingCustomer: Customer | null;
  referralValidation: any;
  onUpdateField: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function CustomerForm({
  show,
  formData,
  editingCustomer,
  referralValidation,
  onUpdateField,
  onSave,
  onCancel,
}: CustomerFormProps) {
  const [emailTouched, setEmailTouched] = useState(false);
  const emailValid = useMemo(() => {
    if (!formData.email) return false;
    // Simple RFC-ish email regex (good enough for basic validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  }, [formData.email]);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const phoneValid = useMemo(() => {
    const v = formData.phone || "";
    if (!v) return false;
    // Normalize by removing spaces, dashes and parentheses
    const norm = v.replace(/[\s-.()]/g, "");
    // Accept formats like +4915112345678 (mobile: prefixes 15,16,17) or +49 30 123456 (landline)
    // Mobile: +49(15|16|17) followed by 7-9 digits
    const mobileRe = /^\+49(?:1[5-7])\d{7,9}$/;
    // Landline: +49 followed by area code starting 2-9 and then 6-12 digits total
    const landlineRe = /^\+49[2-9]\d{6,12}$/;
    return mobileRe.test(norm) || landlineRe.test(norm);
  }, [formData.phone]);
  const [postcodeTouched, setPostcodeTouched] = useState(false);
  const postcodeValid = useMemo(() => {
    const p = formData.postcode || "";
    // Accept exactly 5 digits
    return /^\d{5}$/.test(p);
  }, [formData.postcode]);
  const [priceTouched, setPriceTouched] = useState(false);
  const priceValid = useMemo(() => {
    const p = formData.price || "";
    if (!p) return false;
    const numPrice = parseFloat(p);
    // Price must be a valid number and not negative
    return !isNaN(numPrice) && numPrice >= 0;
  }, [formData.price]);
  if (!show) return null;

  return (
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
              onClick={onCancel}
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
                  value={formData.firstname ?? ""}
                  onChange={(e) => onUpdateField("firstname", e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Last name..."
                  value={formData.lastname ?? ""}
                  onChange={(e) => onUpdateField("lastname", e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Company name
                </label>
                <input
                  type="text"
                  placeholder="Company name..."
                  value={formData.companyname ?? ""}
                  onChange={(e) => onUpdateField("companyname", e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email..."
                  value={formData.email ?? ""}
                  onChange={(e) => {
                    onUpdateField("email", e.target.value);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
                {emailTouched && !emailValid && (
                  <p className="mt-2 text-xs text-red-600">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Telefon
                </label>
                <input
                  type="text"
                  placeholder="Telefon..."
                  value={formData.phone ?? ""}
                  onChange={(e) => onUpdateField("phone", e.target.value)}
                  onBlur={() => setPhoneTouched(true)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
                {phoneTouched && !phoneValid && (
                  <p className="mt-2 text-xs text-red-600">
                    Please enter the phone number in the format with country
                    code +49 (e.g., +4915112345678).
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Address..."
                  value={formData.address ?? ""}
                  onChange={(e) => onUpdateField("address", e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City..."
                  value={formData.city ?? ""}
                  onChange={(e) => onUpdateField("city", e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Postcode
                </label>
                <input
                  type="text"
                  placeholder="Postcode..."
                  value={formData.postcode ?? ""}
                  onChange={(e) => onUpdateField("postcode", e.target.value)}
                  onBlur={() => setPostcodeTouched(true)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
                {postcodeTouched && !postcodeValid && (
                  <p className="mt-2 text-xs text-red-600">
                    Postcode must be exactly 5 digits.
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Price (EUR)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter price..."
                  value={formData.price ?? ""}
                  onChange={(e) => onUpdateField("price", e.target.value)}
                  onBlur={() => setPriceTouched(true)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
                {priceTouched && !priceValid && (
                  <p className="mt-2 text-xs text-red-600">
                    Price must be a valid non-negative number.
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Reference (Referenzcode - Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter reference code..."
                  value={formData.reference ?? ""}
                  onChange={(e) => onUpdateField("reference", e.target.value)}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 border rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 content text-sm sm:text-base ${
                    referralValidation?.isValid
                      ? "bg-emerald-50 border-emerald-300 focus:ring-emerald-500"
                      : referralValidation?.error
                      ? "bg-red-50 border-red-300 focus:ring-red-500"
                      : "bg-white/80 border-[#131313]/20 focus:ring-[#131313]"
                  }`}
                />
                {referralValidation && (
                  <div className="mt-2 p-3 rounded-lg text-sm">
                    {referralValidation.isValid ? (
                      <div className="bg-emerald-100 text-emerald-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <svg
                            className="w-4 h-4 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <strong>Valid reference code!</strong>
                        </div>
                        <p>Referred by: {referralValidation.referrerName}</p>
                        {referralValidation.discount && (
                          <div className="mt-1 text-xs">
                            <p>Discount: %{referralValidation.discount.rate}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-red-100 text-red-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-red-600"
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
                          <span>{referralValidation.error}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#131313]/5 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-[#131313]/10 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end -mt-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#131313]/30 text-[#131313] rounded-xl font-medium hover:bg-[#131313]/5 transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={
              !(emailValid && phoneValid && postcodeValid && priceValid)
            }
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 text-sm sm:text-base order-1 sm:order-2 ${
              emailValid && phoneValid && postcodeValid && priceValid
                ? "bg-[#131313] hover:bg-[#131313]/90 text-white hover:shadow-xl hover:scale-105"
                : "bg-gray-200 text-gray cursor-not-allowed shadow-none"
            }`}
          >
            {editingCustomer ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
