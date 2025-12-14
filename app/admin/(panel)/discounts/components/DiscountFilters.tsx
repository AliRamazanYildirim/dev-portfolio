import { Filter, RefreshCcw, Search, X } from "lucide-react";

interface DiscountFiltersProps {
  searchTerm: string;
  statusFilter: "all" | "pending" | "sent";
  loading: boolean;
  onSearchTermChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | "pending" | "sent") => void;
  onReset: () => void;
  onRefresh: () => void;
}

export function DiscountFilters({
  searchTerm,
  statusFilter,
  loading,
  onSearchTermChange,
  onStatusFilterChange,
  onReset,
  onRefresh,
}: DiscountFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 md:gap-4 w-full">
      <div className="relative w-full md:w-72 lg:w-80 md:ml-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#131313]/50" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search customer, email or referral code"
          className="w-full rounded-lg border border-[#131313]/10 bg-white px-10 py-2 text-sm text-[#131313] shadow focus:outline-none focus:ring focus:ring-[#0f1724]/20"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#131313]/50" />
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(
                event.target.value as "all" | "pending" | "sent"
              )
            }
            className="appearance-none cursor-pointer rounded-lg border border-[#131313]/10 bg-white pl-10 pr-8 py-2 text-sm text-[#131313] shadow focus:outline-none focus:ring focus:ring-[#0f1724]/20"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
          </select>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border border-[#131313]/10 bg-white px-3 py-2 text-sm font-semibold text-[#131313] shadow hover:bg-[#131313]/10"
        >
          <X className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#131313] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#131313]/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
