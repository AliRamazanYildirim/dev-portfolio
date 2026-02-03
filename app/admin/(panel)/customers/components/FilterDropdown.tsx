import { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown } from "lucide-react";

export default function FilterDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const options: { value: string; label: string }[] = [
    { value: "none", label: "Filter" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "name_asc", label: "Name: A → Z" },
    { value: "name_desc", label: "Name: Z → A" },
    { value: "created_asc", label: "Created: Old → New" },
    { value: "created_desc", label: "Created: New → Old" },
    { value: "date_range", label: "Created between..." },
  ];

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full sm:w-auto bg-[#131313] text-white font-semibold rounded-lg px-3 py-1.5 text-sm shadow flex items-center gap-2 min-w-27.5 h-9"
      >
        <Filter className="w-4 h-4 text-white/70" />
        <span className="sm:hidden">Filter</span>
        <span className="hidden sm:inline">Filter / Sort</span>
        <ChevronDown
          className={`w-4 h-4 text-white/70 ml-auto ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-55 w-56 sm:w-64 bg-[#131313] rounded-lg shadow-lg border border-white/10 overflow-hidden z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm whitespace-normal ${
                opt.value === value
                  ? "bg-blue-600 text-white"
                  : "text-white hover:bg-white/5"
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
