import { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import { DiscountEntry, PaginationState } from "../types";
import { currencyFormatter, formatDate } from "../utils";

const DISCOUNT_RATES = [3, 6, 9] as const;
const BONUS_RATE = "+3" as const;

interface DiscountRecordsProps {
  filteredInvoices: DiscountEntry[];
  paginatedRecords: DiscountEntry[];
  pagination: PaginationState;
  mutatingId: string | null;
  mutationAction: "status" | "delete" | "email" | "reset" | null;
  onMarkAsSent: (entry: DiscountEntry) => void;
  onMarkAsPending: (entry: DiscountEntry) => void;
  onDelete: (entry: DiscountEntry) => void;
  onSendEmail: (entry: DiscountEntry, rate: number | "+3") => void;
  onResetEmail: (entry: DiscountEntry) => void;
}

export function DiscountRecords({
  filteredInvoices,
  paginatedRecords,
  pagination,
  mutatingId,
  mutationAction,
  onMarkAsSent,
  onMarkAsPending,
  onDelete,
  onSendEmail,
  onResetEmail,
}: DiscountRecordsProps) {
  const [selectedRates, setSelectedRates] = useState<
    Record<string, number | "+3">
  >({});

  const getSelectedRate = (
    itemId: string,
    defaultRate: number,
    hasReachedMax: boolean
  ): number | "+3" => {
    const selected = selectedRates[itemId];
    if (selected !== undefined) return selected;
    // If reached max (9%), default to bonus "+3"
    return hasReachedMax ? BONUS_RATE : defaultRate;
  };

  const handleRateChange = (itemId: string, rate: number | "+3") => {
    setSelectedRates((prev) => ({ ...prev, [itemId]: rate }));
  };

  const hasReachedMaxDiscount = (entry: DiscountEntry) => {
    return entry.referralLevel >= 3 || entry.discountRate >= 9;
  };

  const getStageLabel = (entry: DiscountEntry) => {
    if (entry.isBonus) {
      // Calculate bonus number: referralLevel - 3 (since stages are 1,2,3)
      const bonusNumber = entry.referralLevel > 3 ? entry.referralLevel - 3 : 1;
      return `Bonus ${bonusNumber}`;
    }
    return `Stage ${entry.referralLevel}`;
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-[#131313]">
          Discount Records
        </h2>
        <span className="rounded-full bg-amber-500/50 px-4 py-1 text-[#0f1724] text-sm font-semibold">
          {filteredInvoices.length} records listed
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0f1724]/95 shadow-lg">
        <div className="hidden md:block">
          <table className="min-w-full text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/80">
                <th className="px-5 py-3 font-semibold">Referrer / User</th>
                <th className="px-5 py-3 font-semibold">Referral Code</th>
                <th className="px-5 py-3 font-semibold">Discount Rate %</th>
                <th className="px-5 py-3 font-semibold">Discount Amount (€)</th>
                <th className="px-5 py-3 font-semibold">Sent Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-white/60"
                  >
                    No discount record found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => {
                  const customerName = item.customer
                    ? `${item.customer.firstname} ${item.customer.lastname}`.trim()
                    : "Unknown customer";
                  const discountAmount =
                    item.discountAmount ??
                    Math.max(item.originalPrice - item.finalPrice, 0);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 last:border-none"
                    >
                      <td className="px-5 py-4 align-top font-medium text-white">
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/50">
                              Referrer
                            </p>
                            <p className="text-sm font-semibold text-white">
                              {item.referrer
                                ? `${item.referrer.firstname} ${item.referrer.lastname}`.trim() ||
                                  "Unknown customer"
                                : "Referrer not found"}
                            </p>
                            <p className="text-xs text-white/60">
                              {item.referrer?.email ?? "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/50">
                              User of referral
                            </p>
                            <p className="text-xs text-white/70">
                              {customerName || "Unknown customer"}
                            </p>
                            <p className="text-[11px] text-white/40">
                              {item.customer?.email ?? "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-white/80">
                        {item.referrerCode}
                      </td>
                      <td className="px-5 py-4 align-top text-white/80">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            %{item.discountRate.toFixed(0)}
                          </span>
                          <span
                            className={`text-xs ${
                              item.isBonus
                                ? "text-emerald-400"
                                : "text-white/60"
                            }`}
                          >
                            {getStageLabel(item)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-white/80">
                        <div className="flex flex-col">
                          <span>
                            {currencyFormatter.format(discountAmount)}
                          </span>
                          <span className="text-xs text-white/50">
                            {currencyFormatter.format(item.finalPrice)} /{" "}
                            {currencyFormatter.format(item.originalPrice)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-white/80">
                        {formatDate(item.discountSentAt)}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex flex-col items-center gap-2">
                          {/* Invoice status */}
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                              item.discountStatus === "sent"
                                ? "bg-emerald-500/70 text-emerald-100"
                                : "bg-amber-500/70 text-amber-100"
                            }`}
                          >
                            {item.discountStatus === "sent"
                              ? "Sent"
                              : "Pending"}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-center text-white/50">
                          Created: {formatDate(item.createdAt)}
                        </p>
                        <div className="mt-2 flex flex-col gap-2">
                          {/* Email gönderim bölümü */}
                          {!item.emailSent && (
                            <div className="flex items-center gap-2">
                              <select
                                value={getSelectedRate(
                                  item.id,
                                  item.discountRate,
                                  hasReachedMaxDiscount(item)
                                )}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleRateChange(
                                    item.id,
                                    val === "+3" ? "+3" : Number(val)
                                  );
                                }}
                                className="rounded-md bg-white/10 px-2 py-1 text-xs text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                disabled={mutatingId === item.id}
                              >
                                {DISCOUNT_RATES.map((rate) => (
                                  <option
                                    key={rate}
                                    value={rate}
                                    className="bg-slate-800"
                                  >
                                    {rate}%
                                  </option>
                                ))}
                                {hasReachedMaxDiscount(item) && (
                                  <option
                                    value="+3"
                                    className="bg-emerald-800 text-emerald-100"
                                  >
                                    +3% Bonus
                                  </option>
                                )}
                              </select>
                              <button
                                onClick={() =>
                                  onSendEmail(
                                    item,
                                    getSelectedRate(
                                      item.id,
                                      item.discountRate,
                                      hasReachedMaxDiscount(item)
                                    )
                                  )
                                }
                                disabled={mutatingId === item.id}
                                className="flex-1 rounded-md bg-indigo-500/70 px-3 py-1 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {mutationAction === "email" &&
                                mutatingId === item.id
                                  ? "Sending..."
                                  : "📧 Send"}
                              </button>
                            </div>
                          )}

                          {/* Status toggle */}
                          {item.discountStatus === "pending" ? (
                            <button
                              onClick={() => onMarkAsSent(item)}
                              disabled={mutatingId === item.id}
                              className="rounded-md bg-emerald-500/70 px-3 py-1 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {mutationAction === "status" &&
                              mutatingId === item.id
                                ? "Updating..."
                                : "Mark Sent"}
                            </button>
                          ) : (
                            <button
                              onClick={() => onMarkAsPending(item)}
                              disabled={mutatingId === item.id}
                              className="rounded-md bg-amber-500/70 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {mutationAction === "status" &&
                              mutatingId === item.id
                                ? "Updating..."
                                : "Revert"}
                            </button>
                          )}
                          {/* Reset Email Button - only show if email was sent */}
                          {item.emailSent && (
                            <button
                              onClick={() => onResetEmail(item)}
                              disabled={mutatingId === item.id}
                              className="rounded-md bg-orange-500/70 px-3 py-1 text-xs font-semibold text-orange-100 transition hover:bg-orange-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {mutationAction === "reset" &&
                              mutatingId === item.id
                                ? "Resetting..."
                                : "🔄 Reset"}
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(item)}
                            disabled={mutatingId === item.id}
                            className="rounded-md bg-red-500/70 px-3 py-1 text-xs font-semibold text-red-100 transition hover:bg-red-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {mutationAction === "delete" &&
                            mutatingId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4 p-4">
          {filteredInvoices.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              No discount record found matching the selected filters.
            </div>
          ) : (
            paginatedRecords.map((item) => {
              const customerName = item.customer
                ? `${item.customer.firstname} ${item.customer.lastname}`.trim()
                : "Unknown customer";
              const discountAmount =
                item.discountAmount ??
                Math.max(item.originalPrice - item.finalPrice, 0);
              return (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
                >
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                        Referrer
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {item.referrer
                          ? `${item.referrer.firstname} ${item.referrer.lastname}`.trim() ||
                            "Unknown customer"
                          : "Referrer not found"}
                      </p>
                      <p className="text-xs text-white/60">
                        {item.referrer?.email ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                        User of Referral
                      </p>
                      <p className="text-xs text-white/70">
                        {customerName || "Unknown customer"}
                      </p>
                      <p className="text-[11px] text-white/40">
                        {item.customer?.email ?? "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-white/50 mb-1">
                        Referral Code
                      </p>
                      <p className="font-semibold text-white">
                        {item.referrerCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-1">
                        Discount Rate
                      </p>
                      <p className="font-semibold text-white">
                        %{item.discountRate.toFixed(0)}
                      </p>
                      <p
                        className={`text-xs ${
                          item.isBonus ? "text-emerald-400" : "text-white/60"
                        }`}
                      >
                        {getStageLabel(item)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-white/50 mb-1">
                        Discount Amount
                      </p>
                      <p className="font-semibold text-white">
                        {currencyFormatter.format(discountAmount)}
                      </p>
                      <p className="text-xs text-white/50">
                        {currencyFormatter.format(item.finalPrice)} /{" "}
                        {currencyFormatter.format(item.originalPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-1">Sent Date</p>
                      <p className="text-white text-xs">
                        {formatDate(item.discountSentAt)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          item.discountStatus === "sent"
                            ? "bg-emerald-500/70 text-emerald-100"
                            : "bg-amber-500/70 text-amber-100"
                        }`}
                      >
                        {item.discountStatus === "sent" ? "Sent" : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mb-2">
                      Created: {formatDate(item.createdAt)}
                    </p>
                    <div className="flex flex-col gap-2">
                      {/* Email gönderim bölümü - Mobile */}
                      {!item.emailSent && (
                        <div className="flex items-center gap-2">
                          <select
                            value={getSelectedRate(
                              item.id,
                              item.discountRate,
                              hasReachedMaxDiscount(item)
                            )}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleRateChange(
                                item.id,
                                val === "+3" ? "+3" : Number(val)
                              );
                            }}
                            className="rounded-md bg-white/10 px-2 py-2 text-xs text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            disabled={mutatingId === item.id}
                          >
                            {DISCOUNT_RATES.map((rate) => (
                              <option
                                key={rate}
                                value={rate}
                                className="bg-slate-800"
                              >
                                {rate}%
                              </option>
                            ))}
                            {hasReachedMaxDiscount(item) && (
                              <option
                                value="+3"
                                className="bg-emerald-800 text-emerald-100"
                              >
                                +3% Bonus
                              </option>
                            )}
                          </select>
                          <button
                            onClick={() =>
                              onSendEmail(
                                item,
                                getSelectedRate(
                                  item.id,
                                  item.discountRate,
                                  hasReachedMaxDiscount(item)
                                )
                              )
                            }
                            disabled={mutatingId === item.id}
                            className="flex-1 rounded-md bg-indigo-500/20 px-3 py-2 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {mutationAction === "email" &&
                            mutatingId === item.id
                              ? "Sending..."
                              : "📧 Send Email"}
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {item.discountStatus === "pending" ? (
                          <button
                            onClick={() => onMarkAsSent(item)}
                            disabled={mutatingId === item.id}
                            className="flex-1 rounded-md bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {mutationAction === "status" &&
                            mutatingId === item.id
                              ? "Updating..."
                              : "Mark Sent"}
                          </button>
                        ) : (
                          <button
                            onClick={() => onMarkAsPending(item)}
                            disabled={mutatingId === item.id}
                            className="flex-1 rounded-md bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {mutationAction === "status" &&
                            mutatingId === item.id
                              ? "Updating..."
                              : "Revert"}
                          </button>
                        )}
                      </div>
                      {/* Reset Email Button - Mobile */}
                      {item.emailSent && (
                        <button
                          onClick={() => onResetEmail(item)}
                          disabled={mutatingId === item.id}
                          className="rounded-md bg-orange-500/20 px-3 py-2 text-xs font-semibold text-orange-100 transition hover:bg-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {mutationAction === "reset" && mutatingId === item.id
                            ? "Resetting..."
                            : "🔄 Reset Email"}
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(item)}
                        disabled={mutatingId === item.id}
                        className="rounded-md bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {mutationAction === "delete" && mutatingId === item.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
