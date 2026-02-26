"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/ui/Nav";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import PageBackground from "@/components/ui/PageBackground";
import { useConsoleArt } from "@/hooks/useConsoleArt";

export default function AppShell({ children }: { children: React.ReactNode }) {
  useConsoleArt();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Solutions-style fixed background: grid + animated gold globs */}
      <PageBackground />

      {/* All page content above the background */}
      <div className="relative z-10">
        <Nav />
        {children}
        <ScrollToTopButton />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
