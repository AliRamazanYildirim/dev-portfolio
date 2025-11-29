"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import NoiseBackground from "@/components/NoiseBackground";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSidebarEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (detail && typeof detail.open === "boolean") {
        setIsSidebarOpen(detail.open);
      }
    };

    window.addEventListener("admin-sidebar:set", handleSidebarEvent);
    return () => {
      window.removeEventListener("admin-sidebar:set", handleSidebarEvent);
    };
  }, []);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    []
  );

  return (
    <div className="min-h-screen w-full bg-[#050b18] text-white lg:h-screen lg:overflow-hidden">
      <div className="relative flex min-h-screen w-full lg:h-screen lg:overflow-hidden">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onToggle={toggleSidebar}
        />

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        <div className="flex w-full flex-1 flex-col lg:h-full">
          <main className="flex-1 overflow-y-auto lg:h-full">
            <NoiseBackground mode="dark" intensity={0.1} className="min-h-full">
              <div
                className={cn(
                  "relative z-10 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10",
                  "mx-auto"
                )}
              >
                <div className="mb-6 flex justify-start lg:hidden">
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium transition bg-white/70 hover:bg-white/10"
                  >
                    {isSidebarOpen ? (
                      <>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close sidebar</span>
                      </>
                    ) : (
                      <>
                        <Menu className="h-4 w-4" />
                        <span className="sr-only">Open sidebar</span>
                      </>
                    )}
                  </button>
                </div>
                {children}
              </div>
            </NoiseBackground>
          </main>
        </div>
      </div>
    </div>
  );
}
