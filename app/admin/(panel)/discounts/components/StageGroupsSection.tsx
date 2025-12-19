import { Gift, CheckCircle2, Clock3 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { PaginationState, StageGroup, STAGE_COUNT } from "../types";
import { currencyFormatter, formatDate } from "../utils";
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
          Discount Stages (3 Steps & Bonus)
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
                    {group.bonusCount > 0 && (
                      <p className="text-emerald-400">
                        +{group.bonusCount} bonus
                        {group.bonusCount > 1 ? "es" : ""} earned
                      </p>
                    )}
                  </div>
                </div>

                {/* 3 Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                  {group.stages.map((stage) => (
                    <StageCard
                      key={`${group.referrerCode}-${stage.level}`}
                      stage={stage}
                    />
                  ))}
                </div>

                {/* Bonus Section */}
                {(group.bonusCount > 0 ||
                  group.completedCount === STAGE_COUNT) && (
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="h-5 w-5 text-emerald-400" />
                      <h3 className="text-lg font-semibold text-emerald-400">
                        Bonus Discounts (+3% each)
                      </h3>
                      {group.completedCount === STAGE_COUNT &&
                        group.bonusCount === 0 && (
                          <span className="ml-2 text-xs text-white/50">
                            — Maximum reached! Every new referral earns +3%
                            bonus
                          </span>
                        )}
                    </div>

                    {group.bonuses.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.bonuses.map((bonus, idx) => {
                          const customerName = bonus.customer
                            ? `${bonus.customer.firstname} ${bonus.customer.lastname}`.trim()
                            : "Unknown customer";
                          const isSent = bonus.status === "sent";

                          return (
                            <div
                              key={bonus.id}
                              className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-emerald-400/70">
                                    Bonus #{idx + 1}
                                  </p>
                                  <p className="text-lg font-semibold text-emerald-300">
                                    {currencyFormatter.format(bonus.amount)}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    isSent
                                      ? "bg-emerald-500/15 text-emerald-100 border border-emerald-500/30"
                                      : "bg-amber-500/15 text-amber-100 border border-amber-500/30"
                                  }`}
                                >
                                  {isSent ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <Clock3 className="h-3 w-3" />
                                  )}
                                  <span className="hidden sm:inline">
                                    {isSent ? "Sent" : "Pending"}
                                  </span>
                                </span>
                              </div>
                              <div className="mt-2 space-y-1 text-xs text-white/60">
                                <div className="flex justify-between">
                                  <span>Customer</span>
                                  <span className="text-white/80">
                                    {customerName}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Date</span>
                                  <span>
                                    {formatDate(bonus.discountSentAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-white/50 italic">
                        No bonus discounts yet. New referrals will appear here.
                      </p>
                    )}
                  </div>
                )}
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
