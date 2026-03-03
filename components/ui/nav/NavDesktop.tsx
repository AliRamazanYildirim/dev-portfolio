"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { SupportedLanguage } from "@/contexts/LanguageContext";
import { getIconMaskStyle } from "./shared";
import type { LanguageOption, NavItem } from "./types";

interface NavDesktopProps {
  navItems: readonly NavItem[];
  pathname: string;
  language: SupportedLanguage;
  languages: readonly LanguageOption[];
  currentLanguage: LanguageOption;
  languageAriaLabel: string;
  onLanguageChange: (language: SupportedLanguage) => void;
}

const CLOSE_DELAY_MS = 150;

const isProjectsRoute = (pathname: string) =>
  pathname === "/projects" || pathname.startsWith("/projects/");

export default function NavDesktop({
  navItems,
  pathname,
  language,
  languages,
  currentLanguage,
  languageAriaLabel,
  onLanguageChange,
}: NavDesktopProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuCloseTimer = useRef<number | null>(null);

  const clearLanguageMenuCloseTimer = () => {
    if (languageMenuCloseTimer.current) {
      window.clearTimeout(languageMenuCloseTimer.current);
      languageMenuCloseTimer.current = null;
    }
  };

  const scheduleLanguageMenuClose = () => {
    clearLanguageMenuCloseTimer();
    languageMenuCloseTimer.current = window.setTimeout(() => {
      setLanguageMenuOpen(false);
      languageMenuCloseTimer.current = null;
    }, CLOSE_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      if (languageMenuCloseTimer.current) {
        window.clearTimeout(languageMenuCloseTimer.current);
        languageMenuCloseTimer.current = null;
      }
    };
  }, []);

  const isActive = (path: string) => pathname === path;
  const projectsRouteActive = isProjectsRoute(pathname);

  const openSubmenu = (index: number) => {
    setHoveredIndex(index);
    setOpenSubmenuIndex(index);
  };

  const closeSubmenu = () => {
    setOpenSubmenuIndex(null);
    setHoveredIndex(null);
  };

  return (
    <>
      <div className="hidden lg:flex space-x-8">
        {navItems.map((item, index) => {
          if (item.submenu) {
            return (
              <div
                key={item.title}
                className="relative group"
                onMouseEnter={() => openSubmenu(index)}
                onMouseLeave={closeSubmenu}
              >
                <button
                  type="button"
                  className="button lg:text-lgButton transition flex items-center gap-1 text-zinc-800 dark:text-white hover:text-zinc-800 dark:hover:text-white"
                >
                  <span>{item.title}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openSubmenuIndex === index ? "rotate-180" : ""
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

                <AnimatePresence>
                  {openSubmenuIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full w-80 pt-3 z-50"
                    >
                      <div className="rounded-lg border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900 shadow-xl overflow-hidden">
                        <div className="p-4 space-y-1">
                          {item.submenu.map((solution) => (
                            <Link
                              key={solution.href}
                              href={solution.href}
                              className="flex items-start gap-3 p-3 rounded-lg transition-colors duration-200 group/item hover:bg-[#c58d12]/8 dark:hover:bg-zinc-800/80"
                              onClick={closeSubmenu}
                            >
                              <div className="shrink-0 mt-1 w-14 h-14 rounded-full bg-zinc-300/55 dark:bg-zinc-700/60 group-hover/item:bg-[#c58d12]/10 dark:group-hover/item:bg-[#c58d12]/15 flex items-center justify-center transition-colors duration-200">
                                <span
                                  role="img"
                                  aria-label={solution.alt || solution.title}
                                  className="block w-8 h-8 bg-current text-zinc-700 dark:text-white group-hover/item:text-[#c58d12] dark:group-hover/item:text-[#c58d12] transition-colors"
                                  style={getIconMaskStyle(solution.icon)}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover/item:text-[#c58d12] dark:group-hover/item:text-[#c58d12] transition">
                                  {solution.title}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                  {solution.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.path ?? item.title}
              href={item.path || "#"}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`button lg:text-lgButton text-zinc-800 dark:text-white hover:text-zinc-800 dark:hover:text-white relative group transition ${
                isActive(item.path || "") ||
                (projectsRouteActive && item.path === "/projects")
                  ? "font-bold underline"
                  : ""
              }`}
              onClick={() => {
                setHoveredIndex(null);
                setOpenSubmenuIndex(null);
              }}
              onMouseEnter={() => {
                setHoveredIndex(index);
                setOpenSubmenuIndex(null);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="relative">
                {hoveredIndex === index ? (
                  <>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent transition-all duration-300 transform scale-x-100 group-hover:scale-x-0" />
                    {item.title}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#c9184a] transition-all duration-300 transform scale-x-0 group-hover:scale-x-100" />
                  </>
                ) : (
                  item.title
                )}
              </span>
            </Link>
          );
        })}
      </div>

      <div
        className="hidden lg:block relative"
        onMouseEnter={() => {
          setOpenSubmenuIndex(null);
          setHoveredIndex(null);
          clearLanguageMenuCloseTimer();
          setLanguageMenuOpen(true);
        }}
        onMouseLeave={scheduleLanguageMenuClose}
      >
        <button
          className="button lg:text-lgButton flex items-center gap-2 transition text-zinc-800 dark:text-white hover:text-zinc-800 dark:hover:text-white"
          aria-haspopup="true"
          aria-expanded={languageMenuOpen}
          aria-label={languageAriaLabel}
          type="button"
          onClick={() => setLanguageMenuOpen((prev) => !prev)}
        >
          <Image
            src={currentLanguage.flag}
            alt={`${currentLanguage.label} flag`}
            width={20}
            height={14}
            className="h-3.5 w-5 rounded-sm object-cover"
          />
          <span className="font-normal">{currentLanguage.label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              languageMenuOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <AnimatePresence>
          {languageMenuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              style={{
                pointerEvents: languageMenuOpen ? "auto" : "none",
              }}
              className="absolute right-0 top-full mt-2 w-44 rounded-md border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900/95 py-2 shadow-lg backdrop-blur z-50 flex flex-col"
              onMouseEnter={clearLanguageMenuCloseTimer}
              onMouseLeave={scheduleLanguageMenuClose}
            >
              {languages.map((item) => (
                <li key={item.code}>
                  <button
                    type="button"
                    onClick={() => {
                      onLanguageChange(item.code);
                      setLanguageMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm transition flex justify-center ${
                      language === item.code
                        ? "font-semibold text-[#c9184a]"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2 w-27.5">
                      <Image
                        src={item.flag}
                        alt={`${item.label} flag`}
                        width={18}
                        height={12}
                        className="h-3 w-4 shrink-0 rounded-sm object-cover"
                      />
                      <span>{item.label}</span>
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
