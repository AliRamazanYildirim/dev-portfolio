"use client";

import { useEffect, useMemo, useState } from "react";
import NoiseBackground from "@/components/NoiseBackground";
import toast from "react-hot-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import { RefreshCcw } from "lucide-react";

// Customer type (kept in sync with customers page)
interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  companyname: string;
  email: string;
  phone: string;
  address: string;
  reference: string;
  price?: number | null;
  createdAt?: string | null; // Prisma style (camelCase)
  created_at?: string | null; // Supabase style (snake_case) - for compatibility
}

function formatMoney(n: number) {
  return `€${n.toLocaleString()}`;
}

function sparklinePath(values: number[], width = 240, height = 60) {
  if (!values || values.length === 0) return "M0,30 L240,30"; // default horizontal line

  // If only one value, draw a horizontal line
  if (values.length === 1) {
    return `M0,${height / 2} L${width},${height / 2}`;
  }

  const max = Math.max(...values);
  const min = Math.min(...values);

  // If all values are the same, create a slight variation for visualization
  const range = max - min || Math.max(1, max * 0.1);
  const step = width / Math.max(1, values.length - 1);

  return values
    .map((v, i) => {
      const x = Math.round(i * step);
      // Add padding to prevent line from touching edges
      const normalizedY = range > 0 ? (v - min) / range : 0.5;
      const y = Math.round(height * 0.1 + normalizedY * height * 0.8);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export default function CustomersStatisticsPage() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState<number>(30);
  const pageSize = 10; // fixed 10 items per page
  const [hydrated, setHydrated] = useState(false);

  // Verwende den Pagination-Hook.
  const pagination = usePagination({
    totalItems: customers.length,
    itemsPerPage: pageSize,
    initialPage: 1,
  });

  // Hydration check + fetch customers
  useEffect(() => {
    setHydrated(true);
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      const json = await res.json();
      if (json?.success)
        setCustomers(
          (json.data || []).map((c: any) => ({
            // normalize Mongo _id to id for stable React keys
            ...c,
            id: c.id ?? c._id ?? (c._id ? String(c._id) : undefined),
          }))
        );
      else setCustomers([]);
    } catch (e) {
      setCustomers([]);
      toast.error("Customers could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = customers.length;
    const revenue = customers.reduce((s, c) => s + (c.price || 0), 0);
    const avg = total > 0 ? revenue / total : 0;

    // customers per day for last N days
    const days = Array.from({ length: rangeDays }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (rangeDays - 1 - i));
      return d.toISOString().slice(0, 10);
    });

    const countsMap: Record<string, number> = {};
    customers.forEach((c) => {
      // Handle both createdAt (Prisma) and created_at (Supabase) formats
      const dateValue = c.createdAt || c.created_at;
      if (!dateValue) return;

      // Parse the date properly
      let dateKey = "";
      try {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          dateKey = date.toISOString().slice(0, 10);
        }
      } catch (e) {
        // If it's already in YYYY-MM-DD format
        if (
          typeof dateValue === "string" &&
          dateValue.match(/^\d{4}-\d{2}-\d{2}/)
        ) {
          dateKey = dateValue.slice(0, 10);
        }
      }

      if (dateKey) {
        countsMap[dateKey] = (countsMap[dateKey] || 0) + 1;
      }
    });

    let counts = days.map((d) => countsMap[d] || 0);

    // If no customers in the selected range, show all customer dates
    const totalInRange = counts.reduce((a, b) => a + b, 0);
    if (totalInRange === 0 && Object.keys(countsMap).length > 0) {
      const allDates = Object.keys(countsMap).sort();
      const earliestDate = allDates[0];
      const latestDate = allDates[allDates.length - 1];

      // Create new date range from earliest to latest customer
      const start = new Date(earliestDate);
      const end = new Date(latestDate);
      const daysDiff =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;

      const newDays = Array.from({ length: daysDiff }).map((_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        return d.toISOString().slice(0, 10);
      });

      counts = newDays.map((d) => countsMap[d] || 0);
    }

    const topCustomers = [...customers]
      .filter((c) => typeof c.price === "number")
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 3);

    return { total, revenue, avg, days, counts, topCustomers };
  }, [customers, rangeDays]);

  // Erhalte paginierte Kunden
  const paginatedCustomers = pagination.paginatedData(customers);

  const sparklinePathMemo = useMemo(() => {
    return sparklinePath(stats.counts, 240, 40);
  }, [stats.counts]);

  if (authLoading) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <NoiseBackground mode="dark" intensity={0.08}>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p className="text-white">Verifying session...</p>
            </div>
          </div>
        </NoiseBackground>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Hydration önlemek için - Prevent hydration mismatch
  if (!hydrated) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <NoiseBackground mode="dark" intensity={0.08}>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p className="text-white">Loading statistics...</p>
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
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="title text-3xl sm:text-4xl md:text-5xl text-black font-bold">
                  User statistics
                </h1>
                <p className="content text-white/70 mt-1">
                  Quick overview — Customer count, revenue, trends, and top
                  customers
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={rangeDays}
                  onChange={(e) => setRangeDays(Number(e.target.value))}
                  className="bg-[#131313] text-white px-6 py-2 rounded-lg text-sm shadow"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={14}>Last 14 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
                <button
                  onClick={fetchCustomers}
                  className="flex items-center justify-center gap-2 bg-white text-[#131313] px-5 py-2 rounded-lg font-semibold shadow hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <RefreshCcw
                    className={`h-4 w-4 text-[#131313] ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

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
                <p className="mt-4 text-sm text-white">
                  Total invoice amount (EUR)
                </p>
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
                <p className="mt-4 text-sm text-white">
                  Average fee per customer
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#eeede9] rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#131313]">
                    Customer inclination
                  </h3>
                  <p className="text-sm text-[#131313]/70">
                    Last {rangeDays} Day
                  </p>
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
                          d={sparklinePathMemo}
                          fill="none"
                          stroke="#131313"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Add points for better visualization */}
                        {stats.counts.map((count, index) => {
                          const x =
                            (index / Math.max(1, stats.counts.length - 1)) *
                            240;
                          const max = Math.max(...stats.counts);
                          const min = Math.min(...stats.counts);
                          const range = max - min || Math.max(1, max * 0.1);
                          const normalizedY =
                            range > 0 ? (count - min) / range : 0.5;
                          const y = 40 * 0.1 + normalizedY * 40 * 0.8;

                          return (
                            <circle
                              key={index}
                              cx={x}
                              cy={y}
                              r="2"
                              fill="#131313"
                            />
                          );
                        })}
                      </svg>
                    </>
                  )}
                  <div className="grid grid-cols-3 gap-3 mt-4 text-sm text-[#131313]/70">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#131313]">
                        Total
                      </span>
                      <span>{stats.counts.reduce((a, b) => a + b, 0)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#131313]">
                        The busiest day
                      </span>
                      <span>
                        {stats.days[
                          stats.counts.indexOf(Math.max(...stats.counts))
                        ] || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#131313]">
                        Average/day
                      </span>
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

              <div className="bg-[#eeede9] rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-[#131313] mb-4">
                  Top Customers
                </h3>
                {loading ? (
                  <div className="py-6 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#131313]" />
                  </div>
                ) : stats.topCustomers.length === 0 ? (
                  <p className="text-sm text-[#131313]/70">
                    There is no customer with fee information yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {stats.topCustomers.map((c) => (
                      <li
                        key={c.id ?? (c as any)._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-[#131313]">
                            {c.firstname} {c.lastname}
                          </div>
                          <div className="text-sm text-[#131313]/70">
                            {c.companyname}
                          </div>
                        </div>
                        <div className="font-semibold text-[#131313]">
                          {formatMoney(c.price || 0)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-8 bg-transparent">
              <div className="bg-[#eeede9] rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#131313]">
                    Customer data
                  </h3>
                  <p className="text-sm text-[#131313]/70">Last records</p>
                </div>
                {loading ? (
                  <div className="py-12 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#131313]" />
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-12 text-[#131313]/70">
                    There are no customers yet.
                  </div>
                ) : (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-sm text-[#131313]/70 border-b border-white/10">
                            <th className="py-3">Name</th>
                            <th className="py-3">Company</th>
                            <th className="py-3">Email</th>
                            <th className="py-3">Price</th>
                            <th className="py-3">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedCustomers.map((c) => (
                            <tr
                              key={c.id ?? (c as any)._id}
                              className="odd:bg-white/60"
                            >
                              <td className="py-3 text-sm text-[#131313] font-medium">
                                {c.firstname} {c.lastname}
                              </td>
                              <td className="py-3 text-sm text-[#131313]/80">
                                {c.companyname}
                              </td>
                              <td className="py-3 text-sm text-[#131313]/80">
                                {c.email}
                              </td>
                              <td className="py-3 text-sm text-[#131313]/80">
                                {c.price != null ? formatMoney(c.price) : "-"}
                              </td>
                              <td className="py-3 text-sm text-[#131313]/80">
                                {c.createdAt || c.created_at
                                  ? (c.createdAt || c.created_at)!.slice(0, 10)
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Zentrales Paginierungskomponente*/}
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      hasNextPage={pagination.hasNextPage}
                      hasPrevPage={pagination.hasPrevPage}
                      onPageChange={pagination.goToPage}
                      onNextPage={pagination.nextPage}
                      onPrevPage={pagination.prevPage}
                      getPageNumbers={pagination.getPageNumbers}
                      getCurrentRange={pagination.getCurrentRange}
                      theme="admin"
                      showInfo={true}
                      size="sm"
                      className="mt-4"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </NoiseBackground>
      </div>
    </main>
  );
}
