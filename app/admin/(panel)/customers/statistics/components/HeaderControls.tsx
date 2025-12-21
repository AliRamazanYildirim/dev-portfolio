import { RefreshCcw, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface HeaderControlsProps {
  rangeDays: number;
  loading: boolean;
  onRangeChange: (value: number) => void;
  onRefresh: () => void;
}

const rangeOptions = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

export function HeaderControls({
  rangeDays,
  loading,
  onRangeChange,
  onRefresh,
}: HeaderControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = rangeOptions.find((opt) => opt.value === rangeDays);

  return (
    <div className="flex flex-row items-center gap-3">
      {/* Custom Dropdown */}
      <div className="relative flex-1 sm:flex-none" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-auto bg-[#131313] text-white px-4 pr-10 py-2 rounded-lg text-sm shadow cursor-pointer flex items-center justify-between min-w-[140px]"
        >
          <span>{selectedOption?.label}</span>
          <ChevronDown
            className={`w-4 h-4 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-0.3 bg-[#131313] rounded-lg shadow-lg border border-white/10 overflow-hidden z-50">
            {rangeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onRangeChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  option.value === rangeDays
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onRefresh}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-[#131313] px-5 py-2 rounded-lg font-semibold shadow hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <RefreshCcw
          className={`h-4 w-4 text-[#131313] ${loading ? "animate-spin" : ""}`}
        />
        <span>Refresh</span>
      </button>
    </div>
  );
}
