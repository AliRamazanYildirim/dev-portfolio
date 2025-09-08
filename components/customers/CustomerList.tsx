import { Customer } from "@/services/customerService";
import NoiseBackground from "@/components/NoiseBackground";
import Pagination from "@/components/ui/Pagination";
import { UsePaginationReturn } from "@/hooks/usePagination";

interface CustomerListProps {
  currentCustomers: Customer[]; // Zaten sayfalanmış müşteriler
  allCustomers: Customer[]; // Toplam müşteri sayısı için
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer) => void;
  pagination: UsePaginationReturn;
}

export default function CustomerList({
  currentCustomers,
  allCustomers,
  selectedCustomer,
  setSelectedCustomer,
  pagination,
}: CustomerListProps) {
  return (
    <div className="lg:col-span-4 xl:col-span-3">
      <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden flex flex-col">
        <NoiseBackground mode="light" intensity={0.1}>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Customer List</h3>
            <p className="text-white/70 text-sm">
              {allCustomers.length} customers total
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

          {/* Pagination - Merkezi Bileşen */}
          <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-white/80">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={pagination.goToPage}
              onNextPage={pagination.nextPage}
              onPrevPage={pagination.prevPage}
              getPageNumbers={pagination.getPageNumbers}
              getCurrentRange={pagination.getCurrentRange}
              theme="admin"
              size="sm"
              showInfo={true}
            />
          </div>
        </NoiseBackground>
      </div>
    </div>
  );
}
