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
        <div className="flex gap-6 justify-center items-center md:justify-start">
          {footerItems.map((item) => {
            const isStaticFile = item.path.endsWith(".pdf");
            const isExternal = item.path.startsWith("http");

            if (isStaticFile) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  download
                  rel="noopener noreferrer"
                  aria-label={`${footerDictionary.socialAriaPrefix} ${item.title}`}
                  className="flex items-center gap-2 text-gray hover:text-black hover:scale-105 transition"
                >
                  <Image
                    src={item.icon}
                    alt={`${item.title} Icon`}
                    width={32}
                    height={32}
                  />
                  <span className="hidden md:inline text-[#260a03]">
                    {item.title}
                  </span>
                </a>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={`${footerDictionary.socialAriaPrefix} ${item.title}`}
                className="flex items-center gap-2 text-gray hover:text-black hover:scale-105 transition"
              >
                <Image
                  src={item.icon}
                  alt={`${item.title} Icon`}
                  width={32}
                  height={32}
                  priority={item.title === "LinkedIn"}
                />
                <span className="hidden md:inline text-[#260a03]">
                  {item.title}
                </span>
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
