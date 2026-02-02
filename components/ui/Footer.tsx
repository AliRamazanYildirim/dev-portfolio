"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { footerItems } from "@/data";
import NoiseBackground from "../NoiseBackground";
import { useTranslation } from "@/hooks/useTranslation";

function Footer({ className }: { className?: string }) {
  const { dictionary } = useTranslation();
  const footerDictionary = dictionary.footer;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <NoiseBackground mode="light" intensity={0.1}>
      <footer
        className={`flex flex-col md:flex-row justify-between items-center py-8 px-5 button md:text-lgButton md:px-20 ${className}`}
      >
        <div className="mt-1 flex flex-nowrap items-center gap-1 md:gap-5 lg:gap-10 overflow-x-auto md:overflow-visible text-[#260a03]">
          {footerItems.map((item) => {
            const isExternal = item.path.startsWith("http");
            const isPdf = item.path.endsWith(".pdf");

            return (
              <Link
                key={item.path}
                href={item.path}
                target={isExternal || isPdf ? "_blank" : undefined}
                rel={isExternal || isPdf ? "noopener noreferrer" : undefined}
                prefetch={isPdf ? false : undefined}
                aria-label={`${footerDictionary.socialAriaPrefix} ${item.title}`}
                className="group flex items-center gap-1 lg:gap-4 text-sm md:text-base lg:text-2xl font-medium transition hover:text-[#c58d12] shrink-0 whitespace-nowrap"
              >
                <Image
                  src={item.icon}
                  alt={`${item.title} Icon`}
                  width={32}
                  height={32}
                  priority={item.title === "LinkedIn"}
                  className="w-7 h-7 md:w-8 md:h-8 lg:w-12 lg:h-12 transition group-hover:scale-105"
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end gap-3 text-[#260a03]">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <Link
              href="/privacy"
              aria-label={footerDictionary.privacyAria}
              className="inline-block rounded px-2 py-1.5 text-sm md:text-base hover:underline hover:text-gray transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#260a03]/30"
            >
              {footerDictionary.privacyLink}
            </Link>
            <span className="hidden md:inline text-gray">•</span>
            <Link
              href="/terms"
              aria-label={footerDictionary.termsAria}
              className="inline-block rounded px-2 py-1.5 text-sm md:text-base hover:underline hover:text-gray transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#260a03]/30"
            >
              {footerDictionary.termsLink}
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="rounded px-2 py-1.5 text-sm md:text-base hover:text-gray hover:underline transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#260a03]/30"
            aria-label={footerDictionary.scrollTopAria}
          >
            {footerDictionary.copyright}
          </button>
        </div>
      </footer>
    </NoiseBackground>
  );
}

export default Footer;
