import Pagination from "@/components/ui/Pagination";
import { PaginationState, StageGroup, STAGE_COUNT } from "../types";
import { currencyFormatter } from "../utils";
import { StageCard } from "./StageCard";

interface StageGroupsSectionProps {
  stageGroups: StageGroup[];
  paginatedStageGroups: StageGroup[];
  pagination: PaginationState;
}

export function StageGroupsSection({
  stageGroups,
  paginatedStageGroups,
  pagination,
}: StageGroupsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-[#131313]">
          Discount Stages (3 Steps)
        </h2>
        <span className="rounded-full bg-amber-400/50 px-4 py-1 text-[#0f1724] text-sm font-semibold">
          {stageGroups.length} referrers being tracked
        </span>
      </div>

      {stageGroups.length === 0 ? (
        <div className="rounded-2xl border border-white/20 bg-[#eeede9] p-6 text-center text-[#131313]/60 shadow-lg">
          No discount stages have been created yet.
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedStageGroups.map((group) => {
            const referrerName = group.referrer
              ? `${group.referrer.firstname} ${group.referrer.lastname}`.trim()
              : "Unknown referrer";

            return (
              <div
                key={group.referrerCode}
                className="rounded-3xl border border-white/10 bg-[#0f1724]/95 p-6 shadow-lg"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">
                      Referrer
                    </p>
                    <p className="text-xl font-semibold text-white">
                      {referrerName}
                    </p>
                    <p className="text-sm text-white/60">
                      {group.referrer?.email ?? "-"}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      Referral code:{" "}
                      {group.referrer?.referralCode ?? group.referrerCode}
                    </p>
                  </div>
                  <div className="text-sm text-white/70 space-y-1 text-right">
                    <p className="font-semibold text-white">
                      {currencyFormatter.format(group.totalDiscount)} total
                      discount
                    </p>
                    <p>
                      {group.completedCount} / {STAGE_COUNT} stages completed
                    </p>
                    {group.pendingCount > 0 && (
                      <p>{group.pendingCount} stages awaiting transmission</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                  {group.stages.map((stage) => (
                    <StageCard
                      key={`${group.referrerCode}-${stage.level}`}
                      stage={stage}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
        onPageChange={pagination.onPageChange}
        onNextPage={pagination.onNextPage}
        onPrevPage={pagination.onPrevPage}
        getPageNumbers={pagination.getPageNumbers}
        getCurrentRange={pagination.getCurrentRange}
        theme="admin"
        className="mt-4"
      />
    </section>
  );
}
