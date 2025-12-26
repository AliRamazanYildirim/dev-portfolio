"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";

import NoiseBackground from "@/components/NoiseBackground";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useDiscounts } from "./hooks/useDiscounts";

import { DiscountFilters } from "./components/DiscountFilters";
import {
  confirmMarkPending,
  confirmDelete,
  confirmResetEmail,
} from "./components/confirmToasts";
import { DiscountRecords } from "./components/DiscountRecords";
import { DiscountSummary } from "./components/DiscountSummary";
import { StageGroupsSection } from "./components/StageGroupsSection";
import {
  DiscountEntry,
  DiscountResponse,
  RECORDS_PER_PAGE,
  STAGE_GROUPS_PER_PAGE,
} from "./types";
import {
  buildPagination,
  calculateTotalRecovered,
  computeStageGroups,
} from "./utils";

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
    loadSettings,
    updateInvoice,
    deleteDiscount,
    sendEmail,
    resetEmail,
    markAsSent,
    markAsPending,
    toggleEnabled,
    setData,
    setDiscountsEnabled,
  } = useDiscounts({ isAuthenticated, authLoading });

  const totalRecovered = useMemo(
    () => calculateTotalRecovered(data.sent),
    [data.sent]
  );

  const allInvoices = useMemo(() => {
    return [
      ...data.pending.map((entry) => ({
        ...entry,
        discountStatus: "pending" as const,
      })),
      ...data.sent.map((entry) => ({
        ...entry,
        discountStatus: "sent" as const,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data.pending, data.sent]);

  const filteredInvoices = useMemo(() => {
    return allInvoices.filter((entry) => {
      const matchesStatus =
        statusFilter === "all" || entry.discountStatus === statusFilter;
      if (!matchesStatus) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.trim().toLowerCase();
      const customerName = entry.customer
        ? `${entry.customer.firstname} ${entry.customer.lastname}`.toLowerCase()
        : "";
      const customerEmail = entry.customer?.email?.toLowerCase() ?? "";
      return (
        customerName.includes(term) ||
        customerEmail.includes(term) ||
        entry.referrerCode.toLowerCase().includes(term)
      );
    });
  }, [allInvoices, searchTerm, statusFilter]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredInvoices.length / RECORDS_PER_PAGE)
    );
    if (recordsPage > totalPages) setRecordsPage(totalPages);
  }, [filteredInvoices.length, recordsPage]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (recordsPage - 1) * RECORDS_PER_PAGE;
    return filteredInvoices.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  }, [filteredInvoices, recordsPage]);

  const recordPagination = useMemo(
    () =>
      buildPagination(
        filteredInvoices.length,
        RECORDS_PER_PAGE,
        recordsPage,
        setRecordsPage
      ),
    [filteredInvoices.length, recordsPage]
  );

  const stageGroups = useMemo(
    () => computeStageGroups(allInvoices),
    [allInvoices]
  );

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(stageGroups.length / STAGE_GROUPS_PER_PAGE)
    );
    if (stagesPage > totalPages) setStagesPage(totalPages);
  }, [stageGroups.length, stagesPage]);

  const paginatedStageGroups = useMemo(() => {
    const startIndex = (stagesPage - 1) * STAGE_GROUPS_PER_PAGE;
    return stageGroups.slice(startIndex, startIndex + STAGE_GROUPS_PER_PAGE);
  }, [stageGroups, stagesPage]);

  const stagePagination = useMemo(
    () =>
      buildPagination(
        stageGroups.length,
        STAGE_GROUPS_PER_PAGE,
        stagesPage,
        setStagesPage
      ),
    [stageGroups.length, stagesPage]
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setRecordsPage(1);
    setStagesPage(1);
  };

  const handleMarkAsSent = async (entry: DiscountEntry) => {
    try {
      await markAsSent(entry);
    } catch (error) {
      console.error(error);
      toast.error("Discount status could not be updated");
    }
  };

  const handleMarkAsPending = (entry: DiscountEntry) => {
    confirmMarkPending(entry, async () => {
      try {
        await markAsPending(entry);
      } catch (error) {
        console.error(error);
        toast.error("Discount status could not be updated");
      }
    });
  };

  const handleDeleteDiscount = (entry: DiscountEntry) => {
    confirmDelete(entry, async () => {
      try {
        await deleteDiscount(entry);
        toast.success("Discount record deleted");
      } catch (error) {
        console.error(error);
        toast.error("Discount could not be deleted");
      }
    });
  };

  const handleSendEmail = async (entry: DiscountEntry, rate: number | "+3") => {
    try {
      await sendEmail(entry, rate);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Email could not be sent"
      );
    }
  };

  const handleResetEmail = (entry: DiscountEntry) => {
    confirmResetEmail(entry, async () => {
      try {
        await resetEmail(entry);
      } catch (error) {
        console.error(error);
        toast.error("Failed to reset email status");
      }
    });
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <NoiseBackground mode="dark" intensity={0.1}>
          <div className="relative z-10 flex items-center justify-center min-h-screen w-full h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
              <p className="text-white text-lg">Session is being verified...</p>
            </div>
          </div>
        </NoiseBackground>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hydrated) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <NoiseBackground mode="dark" intensity={0.1}>
          <div className="relative z-10 flex items-center justify-center min-h-screen w-full h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
              <p className="text-white text-lg">Loading discounts...</p>
            </div>
          </div>
        </NoiseBackground>
      </div>
    );
  }

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
                    const next = !previous;
                    setDiscountsEnabled(next);
                    await toggleEnabled(next, () =>
                      setDiscountsEnabled(previous)
                    );
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
