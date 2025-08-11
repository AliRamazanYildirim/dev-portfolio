"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/ui/Nav";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      <Nav />
      {children}
      {!isAdmin && (
        <>
          <Contact />
          <Footer />
        </>
      )}
    </>
  );
}
