"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import NoiseBackground from "@/components/NoiseBackground";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useDiscounts } from "./hooks/useDiscounts";

import { DiscountFilters } from "./components/DiscountFilters";
import {
  confirmMarkPending,
  confirmDelete,
  confirmResetEmail,
} from "./components/confirmToasts";
import { createDiscountActions } from "./actions/discountActions";
import { DiscountRecords } from "./components/DiscountRecords";
import { DiscountSummary } from "./components/DiscountSummary";
import { StageGroupsSection } from "./components/StageGroupsSection";
import { RECORDS_PER_PAGE, STAGE_GROUPS_PER_PAGE } from "./types";
import { usePageBounds } from "./hooks/usePageBounds";
import { useOptimisticToggle } from "./hooks/useOptimisticToggle";
import FullScreenLoader from "./components/FullScreenLoader";
import {
  useTotalRecovered,
  useAllInvoices,
  useFilteredInvoices,
  usePaginatedRecords,
  useStageGroups,
  usePaginatedStageGroups,
} from "./hooks/useInvoicesMemo";

export default function DiscountTrackingPage() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "sent">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPage, setRecordsPage] = useState(1);
  const [stagesPage, setStagesPage] = useState(1);

  // useDiscounts hook encapsulates data loading and mutation actions
  const {
    data,
    loading,
    settingsLoading,
    discountsEnabled,
    mutatingId,
    mutationAction,
    hydrated,
    loadData,
    deleteDiscount,
    sendEmail,
    resetEmail,
    markAsSent,
    markAsPending,
    toggleEnabled,
    setDiscountsEnabled,
  } = useDiscounts({ isAuthenticated, authLoading });

  const totalRecovered = useTotalRecovered(data.sent);

  const allInvoices = useAllInvoices(data);

  const filteredInvoices = useFilteredInvoices(
    allInvoices,
    statusFilter,
    searchTerm
  );

  usePageBounds(
    filteredInvoices.length,
    RECORDS_PER_PAGE,
    recordsPage,
    setRecordsPage
  );

  const { paginatedRecords, recordPagination } = usePaginatedRecords(
    filteredInvoices,
    recordsPage,
    RECORDS_PER_PAGE,
    setRecordsPage
  );

  const stageGroups = useStageGroups(allInvoices);

  usePageBounds(
    stageGroups.length,
    STAGE_GROUPS_PER_PAGE,
    stagesPage,
    setStagesPage
  );

  const { paginatedStageGroups, stagePagination } = usePaginatedStageGroups(
    stageGroups,
    stagesPage,
    STAGE_GROUPS_PER_PAGE,
    setStagesPage
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setRecordsPage(1);
    setStagesPage(1);
  };

  // create modular action handlers (DI) — keeps page thin and testable
  const {
    handleMarkAsSent,
    handleMarkAsPending,
    handleDeleteDiscount,
    handleSendEmail,
    handleResetEmail,
  } = createDiscountActions({
    markAsSent,
    markAsPending,
    deleteDiscount,
    sendEmail,
    resetEmail,
    confirmMarkPending,
    confirmDelete,
    confirmResetEmail,
  });

  const optimisticToggle = useOptimisticToggle();

  if (authLoading)
    return <FullScreenLoader message="Session is being verified..." />;

  if (!isAuthenticated) {
    return null;
  }

  if (!hydrated) return <FullScreenLoader message="Loading discounts..." />;

  return (
    <main className="relative flex rounded-3xl justify-center items-start flex-col overflow-x-hidden mx-auto w-full">
      <div className="w-full">
        <NoiseBackground mode="light" intensity={0.08}>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
            <header className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="title text-3xl sm:text-4xl md:text-5xl text-black font-bold flex items-center gap-3">
                    <FileText className="h-8 w-8 text-[#131313]" />
                    Discount Tracking
                  </h1>
                  <p className="content text-[#131313]/70 mt-2 max-w-2xl">
                    Track discounts from referral programs here. Records
                    awaiting transmission and completed transmissions are listed
                    in separate sections.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const previous = discountsEnabled;
                    try {
                      await optimisticToggle(
                        previous,
                        setDiscountsEnabled,
                        async (next) => {
                          await toggleEnabled(next, () =>
                            setDiscountsEnabled(previous)
                          );
                        }
                      );
                    } catch (error) {
                      /* error already handled in hook */
                    }
                  }}
                  className="relative inline-flex items-center gap-3 self-end sm:self-auto rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/20"
                  aria-pressed={discountsEnabled}
                  disabled={settingsLoading}
                >
                  <span className="text-sm font-semibold text-[#0f172a]">
                    Referral Discounts
                  </span>
                  <span
                    className={`relative h-6 w-11 rounded-full transition ${
                      discountsEnabled ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                        discountsEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </span>
                  {settingsLoading && (
                    <span className="ml-1 text-xs text-slate-500">
                      Saving...
                    </span>
                  )}
                </button>
              </div>
              <DiscountFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                loading={loading}
                onSearchTermChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onReset={resetFilters}
                onRefresh={loadData}
              />
            </header>

            <DiscountSummary
              pendingCount={data.pending.length}
              sentCount={data.sent.length}
              totalRecovered={totalRecovered}
            />

            <DiscountRecords
              filteredInvoices={filteredInvoices}
              paginatedRecords={paginatedRecords}
              pagination={recordPagination}
              mutatingId={mutatingId}
              mutationAction={mutationAction}
              onMarkAsSent={handleMarkAsSent}
              onMarkAsPending={handleMarkAsPending}
              onDelete={handleDeleteDiscount}
              onSendEmail={handleSendEmail}
              onResetEmail={handleResetEmail}
            />

            <StageGroupsSection
              stageGroups={stageGroups}
              paginatedStageGroups={paginatedStageGroups}
              pagination={stagePagination}
            />
          </div>
        </NoiseBackground>
      </div>
    </main>
  );
}
