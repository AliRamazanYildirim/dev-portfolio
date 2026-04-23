"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { parseAdminLogoutResponse } from "@/lib/contracts/adminLogout";
import { secureFetch } from "@/lib/security/csrfClient";
import NoiseBackground from "@/components/ui/NoiseBackground";
import {
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Users2,
  X,
  ReceiptText,
  TicketPercent,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
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
    match: (pathname: string) =>
      pathname.startsWith("/admin/customers") &&
      !pathname.includes("statistics"),
  },
  {
    label: "Invoice Management",
    href: "/admin/invoices",
    icon: ReceiptText,
    match: (pathname: string) => pathname.startsWith("/admin/invoices"),
  },
  {
    label: "Discounts",
    href: "/admin/discounts",
    icon: TicketPercent,
    match: (pathname: string) => pathname.startsWith("/admin/discounts"),
  },
  {
    label: "Analytics",
    href: "/admin/customers/statistics",
    icon: LineChart,
    match: (pathname: string) => pathname.includes("statistics"),
  },
];

export function AdminSidebar({ isOpen, onClose, onToggle }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const collapsed = !isOpen;

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        onClose();
      }
    },
    [router, onClose],
  );

  const handleLogout = useCallback(async () => {
    try {
      const response = await secureFetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      const parsed = parseAdminLogoutResponse(
        await response.json().catch(() => null),
      );

      if (!parsed.success) {
        console.error("Logout response validation failed", parsed.error);
      }
    } catch (error) {
      // ignore logout errors, still redirect user
    } finally {
      router.push("/admin/login");
      router.refresh();
      onClose();
    }
  }, [router, onClose]);

  const handleGoHome = useCallback(() => {
    router.push("/");
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  }, [router, onClose]);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 transform overflow-hidden transition-all duration-300 ease-out lg:static lg:shrink-0 lg:translate-x-0",
        isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full",
        collapsed ? "lg:w-30" : "lg:w-72",
      )}
    >
      <NoiseBackground
        mode="light"
        intensity={0.08}
        className="relative flex h-full flex-col border-r border-black/10 bg-[#eeede9]"
      >
        <button
          type="button"
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
          onClick={onToggle}
          className={cn(
            "absolute top-4 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/40 text-[#131313] shadow-sm transition hover:bg-white",
            collapsed ? "left-1/2 -translate-x-1/2" : "right-4",
          )}
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>

        <div
          className={cn(
            "flex flex-col items-center pb-8 text-center transition-all",
            collapsed ? "gap-3 pt-12 px-1" : "gap-4 pt-12 px-5",
          )}
        >
          <button
            type="button"
            onClick={handleGoHome}
            className={cn(
              "relative transition-all focus:outline-none cursor-pointer",
              collapsed ? "h-28 w-28 translate-x-1" : "h-52 w-52",
            )}
            aria-label="Go to home page"
          >
            <Image
              src="/ali-ramazan-yildirim.svg"
              alt="Admin logo"
              fill
              loading="eager"
              className={cn(
                "object-contain transition-transform duration-300",
                collapsed ? "scale-100" : "scale-[1.15]",
              )}
            />
          </button>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#131313]">
                Admin Panel
              </span>
              <span className="text-xs font-medium text-[#131313]/70">
                Control Center
              </span>
            </div>
          )}
        </div>

        <nav
          className={cn(
            "flex-1 space-y-1 px-3 transition-all",
            collapsed ? "px-1" : "px-3",
          )}
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname || "");
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "group flex w-full items-center rounded-xl text-sm font-medium transition cursor-pointer",
                  active
                    ? "bg-linear-to-r from-[#04724d] via-[#04471c] to-[#b8dbd9] text-white shadow-lg"
                    : "text-[#131313]/80 hover:bg-black/15 hover:text-[#131313]",
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active ? "text-white" : "text-[#131313]/70",
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div
          className={cn(
            "px-5 pb-8 pt-4 transition-all",
            collapsed ? "px-2" : "px-5",
          )}
        >
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center justify-center rounded-xl bg-[#131313] text-sm font-semibold text-white transition hover:bg-[#131313]/90 cursor-pointer",
              collapsed ? "gap-0 px-0 py-3" : "gap-2 px-4 py-3",
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </NoiseBackground>
    </aside>
  );
}

export default AdminSidebar;
