import { Filter, RefreshCcw, Search, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
      <div className="flex flex-row items-center gap-2">
        <div className="relative flex-shrink-0">
          <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#131313]/50" />
        </div>

        {/* Custom dropdown for All statuses to ensure mobile dropdown positions under trigger */}
        <div
          className="relative flex-shrink-0"
          ref={(el) => {
            /* placeholder for potential ref */
          }}
        >
          <StatusDropdown
            value={statusFilter}
            onChange={(v: "all" | "pending" | "sent") =>
              onStatusFilterChange(v)
            }
          />
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border border-[#131313]/10 bg-white px-3 py-2 text-sm font-semibold text-[#131313] shadow hover:bg-[#131313]/10 flex-shrink-0"
        >
          <X className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#131313] text-white px-3 py-2 rounded-lg font-semibold shadow hover:bg-[#131313]/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}

function StatusDropdown({
  value,
  onChange,
}: {
  value: "all" | "pending" | "sent";
  onChange: (v: "all" | "pending" | "sent") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const options: { value: "all" | "pending" | "sent"; label: string }[] = [
    { value: "all", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "sent", label: "Sent" },
  ];

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="bg-white text-[#131313] rounded-lg px-4 pr-8 py-2 text-sm shadow flex items-center gap-2 min-w-[110px] sm:min-w-[140px]"
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#131313]/70 ml-auto transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-[#131313]/10 overflow-hidden z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm ${
                opt.value === value
                  ? "bg-[#0ea5a4] text-white"
                  : "text-[#131313] hover:bg-[#f3f4f6]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
