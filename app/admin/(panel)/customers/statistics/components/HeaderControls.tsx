import { RefreshCcw } from "lucide-react";

interface HeaderControlsProps {
  rangeDays: number;
  loading: boolean;
  onRangeChange: (value: number) => void;
  onRefresh: () => void;
}

export function HeaderControls({
  rangeDays,
  loading,
  onRangeChange,
  onRefresh,
}: HeaderControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={rangeDays}
        onChange={(event) => onRangeChange(Number(event.target.value))}
        className="bg-[#131313] text-white px-6 py-2 rounded-lg text-sm shadow"
      >
        <option value={7}>Last 7 days</option>
        <option value={14}>Last 14 days</option>
        <option value={30}>Last 30 days</option>
        <option value={90}>Last 90 days</option>
      </select>
      <button
        onClick={onRefresh}
        className="flex items-center justify-center gap-2 bg-white text-[#131313] px-5 py-2 rounded-lg font-semibold shadow hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        <RefreshCcw
          className={`h-4 w-4 text-[#131313] ${loading ? "animate-spin" : ""}`}
        />
        <span>Refresh</span>
      </button>
    </div>
  );
}
