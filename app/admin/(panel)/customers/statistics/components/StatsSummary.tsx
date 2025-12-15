import { StatsSnapshot } from "../types";
import { formatMoney } from "../utils";

interface StatsSummaryProps {
  loading: boolean;
  stats: StatsSnapshot;
}

export function StatsSummary({ loading, stats }: StatsSummaryProps) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white">Total customers</p>
            <p className="text-3xl font-bold text-white mt-2">
              {loading ? "—" : stats.total}
            </p>
          </div>
          <div className="text-sm text-white">Updated</div>
        </div>
        <p className="mt-4 text-sm text-white">
          The total number of records inserted into the customer table
        </p>
      </div>

      <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white">Total revenue</p>
            <p className="text-3xl font-bold text-white mt-2">
              {loading ? "—" : formatMoney(stats.revenue)}
            </p>
          </div>
          <div className="text-lg text-emerald-500">
            {!loading && stats.revenue > 0 && (
              <svg
                className="inline-block w-5 h-5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 17l6-6 4 4 6-6"
                />
              </svg>
            )}
          </div>
        </div>
        <p className="mt-4 text-sm text-white">Total invoice amount (EUR)</p>
      </div>

      <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white">Average process</p>
            <p className="text-3xl font-bold text-white mt-2">
              {loading ? "—" : formatMoney(Math.round(stats.avg))}
            </p>
          </div>
          <div className="text-sm text-white">Avg</div>
        </div>
        <p className="mt-4 text-sm text-white">Average fee per customer</p>
      </div>
    </div>
  );
}
