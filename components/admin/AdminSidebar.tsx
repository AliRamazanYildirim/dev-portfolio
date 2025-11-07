"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import NoiseBackground from "@/components/NoiseBackground";
import {
  LayoutDashboard,
  LineChart,
  LogOut,
  Users2,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Projects",
    href: "/admin",
    icon: LayoutDashboard,
    match: (pathname: string) => pathname === "/admin",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users2,
    match: (pathname: string) => pathname.startsWith("/admin/customers") && !pathname.includes("statistics"),
  },
  {
    label: "Analytics",
    href: "/admin/customers/statistics",
    icon: LineChart,
    match: (pathname: string) => pathname.includes("statistics"),
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // ignore logout errors, still redirect user
    } finally {
      router.push("/admin/login");
      router.refresh();
      onClose();
    }
  }, [router, onClose]);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-out lg:static lg:translate-x-0 lg:flex-shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <NoiseBackground
        mode="light"
        intensity={0.08}
        className="flex h-full flex-col border-r border-black/10 bg-[#eeede9]"
      >
        <div className="flex items-center justify-between px-5 pb-6 pt-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white">
              <Image
                src="/ali-ramazan-yildirim.svg"
                alt="Admin"
                width={32}
                height={32}
                className="h-9 w-9"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#131313]">
                Admin Panel
              </span>
              <span className="text-xs font-medium text-[#131313]/70">
                Actyra Control Center
              </span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full border border-black/10 px-3 py-1 text-sm font-medium text-[#131313] transition hover:bg-black/5 lg:hidden"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname || "");
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-gradient-to-r from-[#04724d] via-[#b8dbd9] to-[#04471c] text-white shadow-lg"
                    : "text-[#131313]/80 hover:bg-black/5 hover:text-[#131313]"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active ? "text-white" : "text-[#131313]/70"
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-5 pb-8 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#131313] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#131313]/90"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </NoiseBackground>
    </aside>
  );
}

export default AdminSidebar;
