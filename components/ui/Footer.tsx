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
          {footerItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
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
          ))}
        </div>

        <button
          onClick={scrollToTop}
          className="mt-6 md:mt-0 md:text-right text-[#260a03] hover:text-gray hover:underline transition"
          aria-label={footerDictionary.scrollTopAria}
        >
          {footerDictionary.copyright}
        </button>
      </footer>
    </NoiseBackground>
  );
}

export default Footer;
