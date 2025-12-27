import { useState, useRef, useEffect } from "react";

interface RateDropdownProps {
  itemId: string;
  value: number | "+3";
  options: (number | "+3")[];
  disabled?: boolean;
  onChange: (id: string, val: number | "+3") => void;
}

export function RateDropdown({
  itemId,
  value,
  options,
  disabled,
  onChange,
}: RateDropdownProps) {
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

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        disabled={disabled}
        className={`rounded-md bg-white/10 px-2 py-1 text-xs text-white border border-white/20 inline-flex items-center gap-2 ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span className="whitespace-nowrap">
          %{typeof value === "number" ? value.toFixed(0) : value}
        </span>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full w-[120%] -translate-x-1/2 bg-[#0f1724]/95 border border-white/10 rounded-md shadow-lg z-50 overflow-hidden">
          {options.map((opt) => (
            <button
              key={String(opt)}
              type="button"
              onClick={() => {
                onChange(itemId, opt);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1 text-xs transition ${
                opt === value
                  ? "bg-indigo-500/80 text-indigo-100"
                  : opt === "+3"
                  ? "text-emerald-200 hover:bg-emerald-800/30"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              {opt === "+3" ? "+3% Bonus" : `${opt}%`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
