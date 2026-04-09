"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { SupportedLanguage } from "@/contexts/LanguageContext";
import { getIconMaskStyle, MOBILE_MENU_VARIANTS } from "./shared";
import type { LanguageOption, NavItem } from "./types";

interface NavMobileProps {
  menuOpen: boolean;
  navItems: readonly NavItem[];
  languages: readonly LanguageOption[];
  language: SupportedLanguage;
  languageLabel: string;
  closeAriaLabel: string;
  onClose: () => void;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export default function NavMobile({
  menuOpen,
  navItems,
  languages,
  language,
  languageLabel,
  closeAriaLabel,
  onClose,
  onLanguageChange,
}: NavMobileProps) {
  const [openSubmenuTitle, setOpenSubmenuTitle] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenuTitle((previous) => (previous === title ? null : title));
  };

  const handleClose = () => {
    setOpenSubmenuTitle(null);
    onClose();
  };

  const handleLanguageChange = (nextLanguage: SupportedLanguage) => {
    setOpenSubmenuTitle(null);
    onLanguageChange(nextLanguage);
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-70"
            onClick={handleClose}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={MOBILE_MENU_VARIANTS}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden fixed inset-0 z-80 flex items-start justify-center px-4 py-6 sm:py-10 landscape:py-4 overflow-y-auto"
            onClick={handleClose}
          >
            <div
              className="relative w-full max-w-md landscape:max-w-3xl rounded-[28px] border border-zinc-200 bg-white/97 dark:border-white/10 dark:bg-zinc-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] backdrop-blur-lg overflow-hidden"
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-3 flex justify-center">
                <span className="h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-white/10" />
              </div>
              <button
                className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/10 p-2 text-zinc-700 dark:text-white shadow-sm transition hover:bg-zinc-200 dark:hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40"
                onClick={handleClose}
                aria-label={closeAriaLabel}
                type="button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <ul className="flex flex-col items-center w-full max-w-105 gap-4 mt-3 px-6 pt-10 pb-8 mx-auto landscape:grid landscape:grid-cols-2 landscape:gap-3 landscape:place-items-center landscape:pt-8 landscape:pb-6 landscape:max-w-none landscape:mt-2">
                {navItems.map((item) =>
                  item.submenu ? (
                    <li
                      key={item.title}
                      className="w-full flex flex-col items-center landscape:col-span-2"
                    >
                      <div className="mx-auto flex w-full max-w-85 items-center gap-2 landscape:max-w-105">
                        <Link
                          href={item.path || "/solutions"}
                          className="button lg:text-lgButton transition flex-1 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-5 py-3 text-center text-zinc-800 dark:text-white shadow-sm hover:border-[#c9184a]/40 hover:bg-zinc-100 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40 landscape:py-2.5"
                          onClick={handleClose}
                        >
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-800 dark:text-white shadow-sm transition hover:border-[#c9184a]/40 hover:bg-zinc-100 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40 landscape:h-10 landscape:w-10"
                          onClick={() => toggleSubmenu(item.title)}
                          aria-label={`${item.title} submenu`}
                        >
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              openSubmenuTitle === item.title
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                      <AnimatePresence>
                        {openSubmenuTitle === item.title && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 grid gap-2 w-full max-w-105 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 p-3 shadow-lg overflow-hidden sm:grid-cols-2 landscape:mt-2 landscape:max-w-160"
                          >
                            {item.submenu.map((solution) => (
                              <Link
                                key={solution.href}
                                href={solution.href}
                                className="flex items-start gap-3 rounded-xl border border-transparent bg-zinc-100 dark:bg-white/5 p-3 transition group/item hover:border-[#c58d12]/40 hover:bg-zinc-200/60 dark:hover:bg-white/10"
                                onClick={handleClose}
                              >
                                <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#c58d12]/20 flex items-center justify-center">
                                  <span
                                    role="img"
                                    aria-label={solution.alt || solution.title}
                                    className="block w-4 h-4 bg-current text-zinc-600 dark:text-white group-hover/item:text-[#c58d12] transition-colors"
                                    style={getIconMaskStyle(solution.icon)}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-white group-hover/item:text-[#c58d12] transition">
                                    {solution.title}
                                  </h4>
                                  <p className="text-xs text-zinc-400 mt-0.5">
                                    {solution.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li
                      key={item.path ?? item.title}
                      className="w-full flex justify-center"
                    >
                      <Link
                        href={item.path || "#"}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="button lg:text-lgButton transition w-full max-w-85 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-5 py-3 text-center text-zinc-800 dark:text-white shadow-sm hover:border-[#c9184a]/40 hover:bg-zinc-100 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40 landscape:py-2.5 landscape:max-w-75"
                        onClick={handleClose}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ),
                )}

                <li className="w-full border-t border-zinc-200 dark:border-white/10 pt-5 landscape:col-span-2 landscape:pt-4">
                  <div className="text-[11px] font-semibold text-zinc-400 dark:text-white/40 uppercase tracking-[0.35em] text-center">
                    {languageLabel}
                  </div>
                  <div className="mt-3 flex flex-col items-center gap-2 landscape:mt-2 landscape:flex-row landscape:flex-wrap landscape:justify-center">
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleLanguageChange(item.code)}
                        className={`w-56 max-w-[80vw] rounded-full border px-4 py-2.5 text-sm transition shadow-sm backdrop-blur-sm landscape:w-40 landscape:py-2 ${
                          language === item.code
                            ? "border-[#c9184a] text-[#c9184a] bg-[#c9184a]/10"
                            : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-700 dark:text-white/80 hover:border-zinc-400 dark:hover:border-white/30 hover:text-zinc-900 dark:hover:text-white"
                        } flex justify-center items-center`}
                      >
                        <span className="flex items-center gap-2 w-27.5">
                          <Image
                            src={item.flag}
                            alt={`${item.label} flag`}
                            width={16}
                            height={12}
                            className="shrink-0 rounded-sm object-cover"
                          />
                          <span>{item.label}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
