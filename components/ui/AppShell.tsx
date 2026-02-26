"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Nav from "@/components/ui/Nav";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import PageBackground from "@/components/ui/PageBackground";
import HangingLampToggle from "@/components/ui/HangingLampToggle";
import { useConsoleArt } from "@/hooks/useConsoleArt";

export default function AppShell({ children }: { children: React.ReactNode }) {
  useConsoleArt();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isAdmin = pathname?.startsWith("/admin");
  const isDark = resolvedTheme !== "light";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDark ? "bg-black" : "bg-[#f5f4f0]"
      }`}
    >
      {/* Animated glow background — gold in dark, soft warm-amber in light */}
      <PageBackground isDark={isDark} />

      {/* All page content above the background */}
      <div className="relative z-10">
        <Nav />
        {children}
        <HangingLampToggle />
        <ScrollToTopButton />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
