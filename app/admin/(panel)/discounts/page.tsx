"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import NoiseBackground from "@/components/NoiseBackground";
import { FileText, RefreshCcw, Search, Filter, X, CheckCircle2, Clock3, Lock } from "lucide-react";
import toast from "react-hot-toast";

interface InvoiceEntry {
  id: string;
  customerId: string;
  referrerCode: string;
  discountRate: number;
  originalPrice: number;
  finalPrice: number;
  discountAmount: number;
  referralLevel: number;
  invoiceStatus: "pending" | "sent";
  invoiceSentAt: string | null;
  createdAt: string;
  referrer: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    companyname: string;
    referralCode: string;
  } | null;
  customer: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    companyname: string;
  } | null;
}

interface InvoiceResponse {
  pending: InvoiceEntry[];
  sent: InvoiceEntry[];
}

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const STAGE_COUNT = 3;

const stageStatusConfig = {
  sent: {
    label: "Gönderildi",
    badgeClass: "bg-emerald-500/15 text-emerald-100 border border-emerald-500/30",
    icon: CheckCircle2,
  },
  pending: {
    label: "Bekliyor",
    badgeClass: "bg-amber-500/15 text-amber-100 border border-amber-500/30",
    icon: Clock3,
  },
  upcoming: {
    label: "Beklenen aşama",
    badgeClass: "bg-slate-500/15 text-slate-100 border border-slate-500/20",
    icon: Clock3,
  },
  locked: {
    label: "Önceki aşama tamamlanmalı",
    badgeClass: "bg-slate-700/20 text-slate-200 border border-slate-600/30",
    icon: Lock,
  },
} as const;

type StageStatus = keyof typeof stageStatusConfig;

interface StageSlot {
  level: number;
  entry: InvoiceEntry | null;
  status: StageStatus;
  amount: number;
  invoiceSentAt: string | null;
}

interface StageGroup {
  referrerCode: string;
  referrer: InvoiceEntry["referrer"];
  stages: StageSlot[];
  totalDiscount: number;
  completedCount: number;
  pendingCount: number;
}

function StageCard({ stage }: { stage: StageSlot }) {
  const statusMeta = stageStatusConfig[stage.status];
  const StatusIcon = statusMeta.icon;
  const stageCustomerName = stage.entry?.customer
    ? `${stage.entry.customer.firstname} ${stage.entry.customer.lastname}`.trim() || "Bilinmeyen müşteri"
    : null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Aşama {stage.level}</p>
            <p className="text-lg font-semibold text-white">
              {stage.entry ? currencyFormatter.format(stage.amount) : "-"}
            </p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}>
            <StatusIcon className="h-4 w-4" />
            {statusMeta.label}
          </span>
        </div>

        {stage.entry ? (
          <div className="space-y-2 text-xs text-white/70">
            <div className="flex justify-between">
              <span>İndirim oranı</span>
              <span className="font-semibold text-white">%{stage.entry.discountRate.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Referansı kullanan</span>
              <span className="text-right text-white/80">
                {stageCustomerName ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Gönderim</span>
              <span>{formatDate(stage.invoiceSentAt)}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-white/60">
            Bu aşama için henüz kayıt bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (error) {
    return value;
  }
}

export default function InvoiceTrackingPage() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [data, setData] = useState<InvoiceResponse>({ pending: [], sent: [] });
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "sent">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const totalRecovered = useMemo(() => {
    return data.sent.reduce(
      (total, entry) => total + (entry.discountAmount ?? Math.max(entry.originalPrice - entry.finalPrice, 0)),
      0
    );
  }, [data.sent]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/discounts");
      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to load invoices");
      }

      setData(json.data);
    } catch (error) {
      console.error(error);
      toast.error("Indirimler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHydrated(true);
    if (!authLoading && isAuthenticated) {
      loadData();
    }
  }, [authLoading, isAuthenticated]);

  const allInvoices = useMemo(() => {
    return [
      ...data.pending.map((entry) => ({ ...entry, invoiceStatus: "pending" as const })),
      ...data.sent.map((entry) => ({ ...entry, invoiceStatus: "sent" as const })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data.pending, data.sent]);

  const filteredInvoices = useMemo(() => {
    return allInvoices.filter((entry) => {
      const matchesStatus = statusFilter === "all" || entry.invoiceStatus === statusFilter;
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

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
  };

  const updateInvoice = async (
    entry: InvoiceEntry,
    payload: Partial<Pick<InvoiceEntry, "invoiceStatus" | "invoiceSentAt">>
  ) => {
    setMutatingId(entry.id);
    try {
      const requestBody: Record<string, unknown> = { id: entry.id };

      if (payload.invoiceStatus) {
        requestBody.invoiceStatus = payload.invoiceStatus;
      }

      if (Object.prototype.hasOwnProperty.call(payload, "invoiceSentAt")) {
        requestBody.invoiceSentAt = payload.invoiceSentAt;
      }

      const response = await fetch("/api/invoices", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Indirim güncellenemedi");
      }

      const { invoiceStatus, invoiceNumber, invoiceSentAt } = json.data as {
        invoiceStatus: "pending" | "sent";
        invoiceNumber: string | null;
        invoiceSentAt: string | null;
      };

      setData((previous) => {
        const nextPending = previous.pending.filter((item) => item.id !== entry.id);
        const nextSent = previous.sent.filter((item) => item.id !== entry.id);

        const updatedEntry: InvoiceEntry = {
          ...entry,
          invoiceStatus,
          invoiceSentAt,
        };

        if (invoiceStatus === "sent") {
          const updatedList = [...nextSent, updatedEntry].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          return {
            pending: nextPending,
            sent: updatedList,
          };
        }

        const updatedList = [...nextPending, updatedEntry].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return {
          pending: updatedList,
          sent: nextSent,
        };
      });

      await loadData().catch((error) => {
        console.error("Failed to reload invoices after patch", error);
      });

      return { invoiceStatus };
    } finally {
      setMutatingId(null);
    }
  };

  const handleMarkAsSent = async (entry: InvoiceEntry) => {
    try {
      await updateInvoice(entry, {
        invoiceStatus: "sent",
      });

      toast.success("Indirim gönderildi olarak işaretlendi");
    } catch (error) {
      console.error(error);
      toast.error("Indirim durumu güncellenemedi");
    }
  };

  const handleMarkAsPending = async (entry: InvoiceEntry) => {
    try {
      const confirmReset = window.confirm(
        "Bu indirimi yeniden bekliyor olarak işaretlemek istediğine emin misin?"
      );

      if (!confirmReset) {
        return;
      }

      await updateInvoice(entry, {
        invoiceStatus: "pending",
        invoiceSentAt: null,
      });

      toast.success("Indirim bekliyor olarak güncellendi");
    } catch (error) {
      console.error(error);
      toast.error("Indirim durumu güncellenemedi");
    }
  };

  const stageGroups = useMemo<StageGroup[]>(() => {
    if (allInvoices.length === 0) return [];

    const map = new Map<string, StageGroup>();

    allInvoices.forEach((entry) => {
      const code = entry.referrer?.referralCode || entry.referrerCode;
      if (!map.has(code)) {
        map.set(code, {
          referrerCode: code,
          referrer: entry.referrer,
          stages: Array.from({ length: STAGE_COUNT }, (_, index) => ({
            level: index + 1,
            entry: null,
            status: index === 0 ? ("upcoming" as StageStatus) : ("locked" as StageStatus),
            amount: 0,
            invoiceSentAt: null,
          })),
          totalDiscount: 0,
          completedCount: 0,
          pendingCount: 0,
        });
      }

      const group = map.get(code)!;
      const index = Math.min(Math.max(entry.referralLevel ?? 1, 1), STAGE_COUNT) - 1;
      const amount = entry.discountAmount ?? Math.max(entry.originalPrice - entry.finalPrice, 0);

      group.stages[index] = {
        level: index + 1,
        entry,
        status: entry.invoiceStatus === "sent" ? "sent" : "pending",
        amount,
        invoiceSentAt: entry.invoiceSentAt,
      };

      if (!group.referrer && entry.referrer) {
        group.referrer = entry.referrer;
      }
    });

    const groups = Array.from(map.values()).map((group) => {
      group.stages = group.stages.map((slot) => {
        // Her stage'in status'u entry'nin invoiceStatus'una bağlı
        if (slot.entry) {
          return {
            ...slot,
            status: slot.entry.invoiceStatus === "sent" ? ("sent" as StageStatus) : ("pending" as StageStatus),
          };
        }
        // Entry yoksa "upcoming" olarak işaretlenecek (başında kullanıcı manuel olarak belirlenebilir)
        return slot;
      });

      const totalDiscount = group.stages.reduce(
        (sum, stage) => sum + (stage.entry ? stage.amount : 0),
        0
      );

      const completedCount = group.stages.filter((stage) => stage.status === "sent").length;
      const pendingCount = group.stages.filter((stage) => stage.status === "pending").length;

      return {
        ...group,
        totalDiscount,
        completedCount,
        pendingCount,
      };
    });

    return groups.sort((a, b) => {
      const aName = `${a.referrer?.firstname ?? ""} ${a.referrer?.lastname ?? ""}`.trim();
      const bName = `${b.referrer?.firstname ?? ""} ${b.referrer?.lastname ?? ""}`.trim();
      return aName.localeCompare(bName);
    });
  }, [allInvoices]);

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
              <p className="text-white text-lg">Loading invoices...</p>
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
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="title text-3xl sm:text-4xl md:text-5xl text-black font-bold flex items-center gap-3">
                  <FileText className="h-8 w-8 text-[#131313]" />
                  Indirim Takibi
                </h1>
                <p className="content text-[#131313]/70 mt-2 max-w-2xl">
                  Referral indirimlerinden doğan indirimleri burada takip et. Göndermeyi bekleyen ve gönderimi tamamlanan kayıtlar ayrı bölümler halinde listelenir.
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 md:gap-4 w-full">
                <div className="relative w-full md:w-72 lg:w-80 md:ml-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#131313]/50" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Müşteri, e-posta veya referral kodu ara"
                    className="w-full rounded-lg border border-[#131313]/10 bg-white px-10 py-2 text-sm text-[#131313] shadow focus:outline-none focus:ring focus:ring-[#0f1724]/20"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="relative">
                    <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#131313]/50" />
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as "all" | "pending" | "sent")}
                      className="appearance-none cursor-pointer rounded-lg border border-[#131313]/10 bg-white pl-10 pr-8 py-2 text-sm text-[#131313] shadow focus:outline-none focus:ring focus:ring-[#0f1724]/20"
                    >
                      <option value="all">Tüm durumlar</option>
                      <option value="pending">Bekleyen</option>
                      <option value="sent">Gönderilen</option>
                    </select>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 rounded-lg border border-[#131313]/10 bg-white px-3 py-2 text-sm font-semibold text-[#131313] shadow hover:bg-[#131313]/10"
                  >
                    <X className="h-4 w-4" />
                    Sıfırla
                  </button>
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-[#131313] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#131313]/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    <span>Yenile</span>
                  </button>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
                <p className="text-sm text-white/80">Bekleyen kayıtlar</p>
                <p className="text-3xl font-bold text-white mt-2">{data.pending.length}</p>
                <p className="mt-4 text-sm text-white/60">
                  Henüz indirimi gönderilmeyen referral işlemleri.
                </p>
              </div>

              <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
                <p className="text-sm text-white/80">Gönderilen kayıtlar</p>
                <p className="text-3xl font-bold text-white mt-2">{data.sent.length}</p>
                <p className="mt-4 text-sm text-white/60">
                  Indirim gönderim süreci tamamlanan kayıtlar.
                </p>
              </div>

              <div className="bg-[#0f1724]/60 rounded-2xl p-5 border border-white/5 shadow-lg">
                <p className="text-sm text-white/80">Gönderilen indirim toplamı</p>
                <p className="text-3xl font-bold text-white mt-2">{currencyFormatter.format(totalRecovered)}</p>
                <p className="mt-4 text-sm text-white/60">
                  Gönderimi tamamlanan aşamaların toplam indirim tutarı.
                </p>
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl font-semibold text-[#131313]">Indirim Kayıtları</h2>
                <span className="rounded-full bg-[#0f1724]/10 px-4 py-1 text-[#0f1724] text-sm font-semibold">
                  {filteredInvoices.length} kayıt listeleniyor
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0f1724]/95 shadow-lg">
                <table className="min-w-full text-sm text-white">
                  <thead>
                      <tr className="border-b border-white/10 text-left text-white/80">
                      <th className="px-5 py-3 font-semibold">Referrer / Kullanan</th>
                      <th className="px-5 py-3 font-semibold">Referral Kodu</th>
                      <th className="px-5 py-3 font-semibold">Kazandığı İndirim %</th>
                      <th className="px-5 py-3 font-semibold">İndirim Tutarı (₺)</th>
                      <th className="px-5 py-3 font-semibold">Gönderim Tarihi</th>
                      <th className="px-5 py-3 font-semibold">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-white/60">
                          Seçilen filtrelere uygun indirim kaydı bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((item) => {
                        const customerName = item.customer
                          ? `${item.customer.firstname} ${item.customer.lastname}`.trim()
                          : "Bilinmeyen müşteri";
                        const discountAmount = item.discountAmount ?? Math.max(item.originalPrice - item.finalPrice, 0);
                        return (
                          <tr key={item.id} className="border-b border-white/5 last:border-none">
                            <td className="px-5 py-4 align-top font-medium text-white">
                              <div className="flex flex-col gap-2">
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-white/50">Referrer</p>
                                  <p className="text-sm font-semibold text-white">
                                    {item.referrer
                                      ? `${item.referrer.firstname} ${item.referrer.lastname}`.trim() || "Bilinmeyen müşteri"
                                      : "Referrer bulunamadı"}
                                  </p>
                                  <p className="text-xs text-white/60">{item.referrer?.email ?? "-"}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-white/50">Referansı kullanan</p>
                                  <p className="text-xs text-white/70">
                                    {customerName || "Bilinmeyen müşteri"}
                                  </p>
                                  <p className="text-[11px] text-white/40">{item.customer?.email ?? "-"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 align-top text-white/80">{item.referrerCode}</td>
                            <td className="px-5 py-4 align-top text-white/80">
                              <div className="flex flex-col">
                                <span className="font-semibold text-white">%{item.discountRate.toFixed(0)}</span>
                                <span className="text-xs text-white/60">Aşama {item.referralLevel}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 align-top text-white/80">
                              <div className="flex flex-col">
                                <span>{currencyFormatter.format(discountAmount)}</span>
                                <span className="text-xs text-white/50">
                                  {currencyFormatter.format(item.finalPrice)} / {currencyFormatter.format(item.originalPrice)}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 align-top text-white/80">{formatDate(item.invoiceSentAt)}</td>
                            <td className="px-5 py-4 align-top">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                  item.invoiceStatus === "sent"
                                    ? "bg-emerald-500/20 text-emerald-200"
                                    : "bg-amber-500/20 text-amber-100"
                                }`}
                              >
                                {item.invoiceStatus === "sent" ? "Gönderildi" : "Bekliyor"}
                              </span>
                              <p className="mt-1 text-xs text-white/50">Oluşturulma: {formatDate(item.createdAt)}</p>
                              <div className="mt-2 flex flex-col gap-2">
                                {item.invoiceStatus === "pending" ? (
                                  <button
                                    onClick={() => handleMarkAsSent(item)}
                                    disabled={mutatingId === item.id}
                                    className="rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {mutatingId === item.id ? "Güncelleniyor..." : "Gönder"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleMarkAsPending(item)}
                                    disabled={mutatingId === item.id}
                                    className="rounded-md bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {mutatingId === item.id ? "Güncelleniyor..." : "Bekle"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl font-semibold text-[#131313]">İndirim Aşamaları (3 Adım)</h2>
                <span className="rounded-full bg-[#0f1724]/10 px-4 py-1 text-[#0f1724] text-sm font-semibold">
                  {stageGroups.length} referrer takip ediliyor
                </span>
              </div>

              {stageGroups.length === 0 ? (
                <div className="rounded-2xl border border-white/20 bg-[#eeede9] p-6 text-center text-[#131313]/60 shadow-lg">
                  Henüz indirim aşaması oluşturulmamış.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {stageGroups.map((group) => {
                    const referrerName = group.referrer
                      ? `${group.referrer.firstname} ${group.referrer.lastname}`.trim()
                      : "Bilinmeyen referrer";

                    return (
                      <div
                        key={group.referrerCode}
                        className="rounded-3xl border border-white/10 bg-[#0f1724]/95 p-6 shadow-lg"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/60">Referrer</p>
                            <p className="text-xl font-semibold text-white">{referrerName}</p>
                            <p className="text-sm text-white/60">{group.referrer?.email ?? "-"}</p>
                            <p className="text-xs text-white/40 mt-1">Referral kodu: {group.referrer?.referralCode ?? group.referrerCode}</p>
                          </div>
                          <div className="text-sm text-white/70 space-y-1 text-right">
                            <p className="font-semibold text-white">
                              {currencyFormatter.format(group.totalDiscount)} toplam indirim
                            </p>
                            <p>{group.completedCount} / {STAGE_COUNT} aşama tamamlandı</p>
                            {group.pendingCount > 0 && (
                              <p>{group.pendingCount} aşama gönderim bekliyor</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                          {group.stages.map((stage) => (
                            <StageCard key={`${group.referrerCode}-${stage.level}`} stage={stage} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </NoiseBackground>
      </div>
    </main>
  );
}
