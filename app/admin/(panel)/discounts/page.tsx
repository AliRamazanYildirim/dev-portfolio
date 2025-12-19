"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";

import NoiseBackground from "@/components/NoiseBackground";
import { useAdminAuth } from "@/hooks/useAdminAuth";

import { DiscountFilters } from "./components/DiscountFilters";
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
  const [data, setData] = useState<DiscountResponse>({ pending: [], sent: [] });
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "sent">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutationAction, setMutationAction] = useState<
    "status" | "delete" | "email" | null
  >(null);
  const [recordsPage, setRecordsPage] = useState(1);
  const [stagesPage, setStagesPage] = useState(1);
  const [discountsEnabled, setDiscountsEnabled] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/discounts");
      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to load discounts");
      }

      setData(json.data);
    } catch (error) {
      console.error(error);
      toast.error("Discounts could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await fetch("/api/admin/settings/discounts");
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to load discounts setting");
      }
      setDiscountsEnabled(Boolean(json.data?.enabled));
    } catch (error) {
      console.error(error);
      toast.error("Discount setting could not be loaded");
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    setHydrated(true);
    if (!authLoading && isAuthenticated) {
      loadData();
      loadSettings();
    }
  }, [authLoading, isAuthenticated]);

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
    if (recordsPage > totalPages) {
      setRecordsPage(totalPages);
    }
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
    if (stagesPage > totalPages) {
      setStagesPage(totalPages);
    }
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
  };

  const updateInvoice = async (
    entry: DiscountEntry,
    payload: Partial<Pick<DiscountEntry, "discountStatus" | "discountSentAt">>
  ) => {
    setMutatingId(entry.id);
    setMutationAction("status");
    try {
      const requestBody: Record<string, unknown> = { id: entry.id };

      if (payload.discountStatus) {
        requestBody.discountStatus = payload.discountStatus;
      }

      if (Object.prototype.hasOwnProperty.call(payload, "discountSentAt")) {
        requestBody.discountSentAt = payload.discountSentAt;
      }

      const response = await fetch("/api/discounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Discount could not be updated");
      }

      const { discountStatus, discountSentAt } = json.data as {
        discountStatus: "pending" | "sent";
        discountSentAt: string | null;
      };

      setData((previous) => {
        const nextPending = previous.pending.filter(
          (item) => item.id !== entry.id
        );
        const nextSent = previous.sent.filter((item) => item.id !== entry.id);

        const updatedEntry: DiscountEntry = {
          ...entry,
          discountStatus,
          discountSentAt,
        };

        if (discountStatus === "sent") {
          const updatedList = [...nextSent, updatedEntry].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          return {
            pending: nextPending,
            sent: updatedList,
          };
        }

        const updatedList = [...nextPending, updatedEntry].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return {
          pending: updatedList,
          sent: nextSent,
        };
      });

      await loadData().catch((error) => {
        console.error("Failed to reload discounts after patch", error);
      });

      return { discountStatus };
    } finally {
      setMutatingId(null);
      setMutationAction(null);
    }
  };

  const handleMarkAsSent = async (entry: DiscountEntry) => {
    try {
      await updateInvoice(entry, { discountStatus: "sent" });
      toast.success("Discount marked as sent");
    } catch (error) {
      console.error(error);
      toast.error("Discount status could not be updated");
    }
  };

  const handleMarkAsPending = (entry: DiscountEntry) => {
    toast.custom(
      (t) => (
        <div className="max-w-md w-full rounded-lg border border-white/10 bg-[#0f1724]/95 p-3 text-sm text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              Are you sure you want to mark this discount as pending again?
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    await updateInvoice(entry, {
                      discountStatus: "pending",
                      discountSentAt: null,
                    });
                    toast.success("Discount marked as pending");
                  } catch (error) {
                    console.error(error);
                    toast.error("Discount status could not be updated");
                  }
                }}
                className="rounded-md bg-amber-500/70 px-3 py-1 text-xs font-semibold text-amber-100 hover:bg-amber-500/50"
              >
                Confirm
              </button>

              <button
                onClick={() => toast.dismiss(t.id)}
                className="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const deleteDiscount = async (entry: DiscountEntry) => {
    setMutatingId(entry.id);
    setMutationAction("delete");
    try {
      const response = await fetch("/api/discounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Discount could not be deleted");
      }

      setData((previous) => ({
        pending: previous.pending.filter((item) => item.id !== entry.id),
        sent: previous.sent.filter((item) => item.id !== entry.id),
      }));

      await loadData().catch((error) => {
        console.error("Failed to reload discounts after delete", error);
      });
    } finally {
      setMutatingId(null);
      setMutationAction(null);
    }
  };

  const handleDeleteDiscount = (entry: DiscountEntry) => {
    toast.custom(
      (t) => (
        <div className="max-w-md w-full rounded-lg border border-white/10 bg-[#0f1724]/95 p-3 text-sm text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              Permanently delete the discount for code{" "}
              <span className="font-semibold text-amber-200">
                {entry.referrerCode}
              </span>
              ? This action cannot be undone.
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    await deleteDiscount(entry);
                    toast.success("Discount record deleted");
                  } catch (error) {
                    console.error(error);
                    toast.error("Discount could not be deleted");
                  }
                }}
                className="rounded-md bg-red-500/70 px-3 py-1 text-xs font-semibold text-red-100 hover:bg-red-500/50"
              >
                Delete
              </button>

              <button
                onClick={() => toast.dismiss(t.id)}
                className="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleSendEmail = async (entry: DiscountEntry, rate: number | "+3") => {
    setMutatingId(entry.id);
    setMutationAction("email");
    try {
      const response = await fetch("/api/admin/discounts/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: entry.id,
          discountRate: rate,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Email could not be sent");
      }

      const rateDisplay = rate === "+3" ? "+3% bonus" : `${rate}%`;
      toast.success(
        `Discount email sent successfully (${rateDisplay} discount applied)`
      );

      // Reload data to reflect updated state
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Email could not be sent"
      );
    } finally {
      setMutatingId(null);
      setMutationAction(null);
    }
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
                    setSettingsLoading(true);
                    try {
                      const response = await fetch(
                        "/api/admin/settings/discounts",
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ enabled: next }),
                        }
                      );
                      const json = await response.json();
                      if (!response.ok || !json.success) {
                        throw new Error(
                          json.error || "Failed to update setting"
                        );
                      }
                      setDiscountsEnabled(Boolean(json.data?.enabled));
                      toast.success(
                        json.data?.enabled
                          ? "Discounts enabled"
                          : "Discounts disabled"
                      );
                    } catch (error) {
                      console.error(error);
                      setDiscountsEnabled(previous);
                      toast.error("Discount setting could not be updated");
                    } finally {
                      setSettingsLoading(false);
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
