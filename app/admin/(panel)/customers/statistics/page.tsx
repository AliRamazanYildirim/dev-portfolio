"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import NoiseBackground from "@/components/ui/NoiseBackground";
import { useAdminAuth } from "../../hooks/useAdminAuth";

import { HeaderControls } from "./components/HeaderControls";
import { StatsSummary } from "./components/StatsSummary";
import { TrendCard } from "./components/TrendCard";
import { TopCustomersCard } from "./components/TopCustomersCard";
import { CustomersTable } from "./components/CustomersTable";
import { Customer, StatsSnapshot } from "./types";
import { computeStats, normalizeCustomers } from "./utils";

export default function CustomersStatisticsPage() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [hydrated, setHydrated] = useState(false);

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
      if (json?.success) {
        setCustomers(normalizeCustomers(json.data || []));
      } else {
        setCustomers([]);
      }
    } catch (e) {
      setCustomers([]);
      toast.error("Customers could not be loaded");
    } finally {
      setLoading(false);
    }
  };
  const stats: StatsSnapshot = useMemo(
    () => computeStats(customers, rangeDays),
    [customers, rangeDays],
  );

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
              <HeaderControls
                rangeDays={rangeDays}
                loading={loading}
                onRangeChange={setRangeDays}
                onRefresh={fetchCustomers}
              />
            </div>
            <StatsSummary loading={loading} stats={stats} />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TrendCard
                loading={loading}
                rangeDays={rangeDays}
                stats={stats}
              />
              <TopCustomersCard loading={loading} stats={stats} />
            </div>

            <CustomersTable customers={customers} loading={loading} />
          </div>
        </NoiseBackground>
      </div>
    </main>
  );
}
