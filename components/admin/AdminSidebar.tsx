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
  Menu,
  Users2,
  X,
  FileText,
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
    label: "Discounts",
    href: "/admin/discounts",
    icon: FileText,
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
        "fixed inset-y-0 left-0 z-40 transform overflow-hidden transition-all duration-300 ease-out lg:static lg:flex-shrink-0 lg:translate-x-0",
        isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full",
        collapsed ? "lg:w-20" : "lg:w-72"
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
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/40 text-[#131313] shadow-sm transition hover:bg-white"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>

        <div
          className={cn(
            "flex flex-col items-center px-5 pt-16 pb-8 text-center transition-all",
            collapsed ? "gap-3" : "gap-4"
          )}
        >
          <div className="relative h-28 w-28 transition-all">
            <Image
              src="/ali-ramazan-yildirim.svg"
              alt="Admin"
              fill
              className="object-contain"
            />
          </div>
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
            collapsed ? "px-1" : "px-3"
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
                  "group flex w-full items-center rounded-xl text-sm font-medium transition",
                  active
                    ? "bg-gradient-to-r from-[#04724d] via-[#04471c] to-[#b8dbd9] text-white shadow-lg"
                    : "text-[#131313]/80 hover:bg-black/15 hover:text-[#131313]",
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active ? "text-white" : "text-[#131313]/70"
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
            collapsed ? "px-2" : "px-5"
          )}
        >
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center justify-center rounded-xl bg-[#131313] text-sm font-semibold text-white transition hover:bg-[#131313]/90",
              collapsed ? "gap-0 px-0 py-3" : "gap-2 px-4 py-3"
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
