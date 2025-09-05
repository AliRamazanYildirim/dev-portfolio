import { Customer } from "@/services/customerService";
import NoiseBackground from "@/components/NoiseBackground";

interface CustomerListProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  customersPerPage: number;
}

export default function CustomerList({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  currentPage,
  setCurrentPage,
  customersPerPage,
}: CustomerListProps) {
  const totalPages = Math.ceil(customers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const endIndex = startIndex + customersPerPage;
  const currentCustomers = customers.slice(startIndex, endIndex);

  return (
    <div className="lg:col-span-4 xl:col-span-3">
      <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden flex flex-col">
        <NoiseBackground mode="light" intensity={0.1}>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Customer List</h3>
            <p className="text-white/70 text-sm">
              {customers.length} customers total
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-2 space-y-2">
              {currentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`group cursor-pointer relative p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    selectedCustomer?.id === customer.id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 shadow-lg"
                      : "bg-white/50 hover:bg-white/80 border border-white/30 hover:border-blue-300/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg transition-all duration-300 ${
                        selectedCustomer?.id === customer.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                          : "bg-gradient-to-r from-slate-400 to-slate-500"
                      }`}
                    >
                      {customer.firstname.charAt(0)}
                      {customer.lastname.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold truncate ${
                          selectedCustomer?.id === customer.id
                            ? "text-slate-800"
                            : "text-slate-700"
                        }`}
                      >
                        {customer.firstname} {customer.lastname}
                      </h4>
                      <p className="text-sm text-slate-500 truncate">
                        {customer.companyname}
                      </p>
                      {customer.price && (
                        <p
                          className={`text-sm font-semibold ${
                            selectedCustomer?.id === customer.id
                              ? "text-emerald-600"
                              : "text-emerald-500"
                          }`}
                        >
                          €{Number(customer.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                    {selectedCustomer?.id === customer.id && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-white/80">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {customers.length === 0 ? 0 : startIndex + 1} -{" "}
                {Math.min(customers.length, endIndex)} of {customers.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    currentPage === 1
                      ? "bg-transparent text-slate-700 cursor-not-allowed"
                      : "bg-white text-slate-700 shadow hover:bg-slate-50"
                  }`}
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
                  {/* Prev */}
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => {
                    const p = i + 1;
                    const active = p === currentPage;
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          active
                            ? "bg-slate-800 text-white"
                            : "bg-white text-slate-700 shadow hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    currentPage === totalPages
                      ? "bg-transparent text-slate-700 cursor-not-allowed"
                      : "bg-white text-slate-700 shadow hover:bg-slate-50"
                  }`}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {/* Next */}
                </button>
              </div>
            </div>
          </div>
        </NoiseBackground>
      </div>
    </div>
  );
}
