import { StatsSnapshot } from "../types";
import { sparklinePath } from "../utils";

interface TrendCardProps {
  loading: boolean;
  rangeDays: number;
  stats: StatsSnapshot;
}

export function TrendCard({ loading, rangeDays, stats }: TrendCardProps) {
  const path = sparklinePath(stats.counts, 240, 40);

  return (
    <div className="lg:col-span-2 bg-[#eeede9] rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[#131313]">
          Customer inclination
        </h3>
        <p className="text-sm text-[#131313]/70">Last {rangeDays} Day</p>
      </div>
      <div className="w-full overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#131313]" />
          </div>
        ) : (
          <>
            <svg viewBox={`0 0 240 60`} className="w-full h-16">
              <path
                d={path}
                fill="none"
                stroke="#131313"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {stats.counts.map((count, index) => {
                const x = (index / Math.max(1, stats.counts.length - 1)) * 240;
                const max = Math.max(...stats.counts);
                const min = Math.min(...stats.counts);
                const range = max - min || Math.max(1, max * 0.1);
                const normalizedY = range > 0 ? (count - min) / range : 0.5;
                const y = 40 * 0.1 + normalizedY * 40 * 0.8;
                return (
                  <circle key={index} cx={x} cy={y} r={2} fill="#131313" />
                );
              })}
            </svg>
          </>
        )}
        <div className="grid grid-cols-3 gap-3 mt-4 text-sm text-[#131313]/70">
          <div className="flex flex-col">
            <span className="font-semibold text-[#131313]">Total</span>
            <span>{stats.counts.reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#131313]">
              The busiest day
            </span>
            <span>
              {stats.days[stats.counts.indexOf(Math.max(...stats.counts))] ||
                "-"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#131313]">Average/day</span>
            <span>
              {(
                stats.counts.reduce((a, b) => a + b, 0) /
                Math.max(1, stats.counts.length)
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
