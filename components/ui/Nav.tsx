"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NoiseBackground from "../NoiseBackground";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import type { SupportedLanguage } from "@/contexts/LanguageContext";

interface NavItemType {
  title: string;
  path?: string;
  external?: boolean;
  submenu?: Array<{
    title: string;
    description: string;
    icon: string;
    alt?: string;
    href: string;
  }>;
}

export const Nav = ({ className }: { className?: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const submenuCloseTimer = React.useRef<number | null>(null);
  const submenuInside = React.useRef(false);
  const langMenuCloseTimer = React.useRef<number | null>(null);
  const langMenuInside = React.useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, dictionary } = useTranslation();
  const navDictionary = dictionary.nav;

  const navItems: readonly NavItemType[] = (
    navDictionary.items as readonly NavItemType[]
  ).filter((item) => item.path !== "/admin/login");
  const languageLabel = navDictionary.languageMenu.label;
  const solutionsData = navDictionary.solutions;
  const languages = [
    {
      code: "en" as SupportedLanguage,
      label: navDictionary.languageMenu.languages.en,
      flag: "/flags/us.svg",
    },
    {
      code: "de" as SupportedLanguage,
      label: navDictionary.languageMenu.languages.de,
      flag: "/flags/de.svg",
    },
    {
      code: "tr" as SupportedLanguage,
      label: navDictionary.languageMenu.languages.tr,
      flag: "/flags/tr.svg",
    },
  ];
  const currentLanguageData =
    languages.find((lang) => lang.code === language) ?? languages[0];
  const currentLanguageLabel = currentLanguageData.label;

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setLanguageMenuOpen(false);
    setSolutionsOpen(false);
  };

  useEffect(() => {
    setLanguageMenuOpen(false);
    setMenuOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen((prev) => !prev);
  };

  const handleLanguageChange = (code: SupportedLanguage) => {
    setLanguage(code);
    setLanguageMenuOpen(false);
    setMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;
  const isProjectsPage =
    pathname === "/projects" || pathname.startsWith("/projects/");
  // Admin-Seite prüfen - Check if admin page
  const isAdminPage = pathname.startsWith("/admin");
  const noiseMode = isProjectsPage || isAdminPage ? "dark" : "light";

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.98 },
  };

  const maskStyle = (icon: string) => ({
    maskImage: `url(${icon})`,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "contain",
    WebkitMaskImage: `url(${icon})`,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "contain",
  });

  type NavItemProps = {
    item: NavItemType;
    index: number;
    hoveredIndex: number | null;
    setHoveredIndex: (index: number | null) => void;
  };

  const NavItem = ({
    item,
    index,
    hoveredIndex,
    setHoveredIndex,
  }: NavItemProps) => {
    // Nur auf den Seiten /projects, /projects/[slug] und /admin weiß - Only white on /projects, /projects/[slug] and /admin pages
    const isProjectsOrDetail =
      pathname === "/projects" || pathname.startsWith("/projects/");
    const hoverTextColor =
      isProjectsOrDetail || isAdminPage ? "text-white" : "text-black";

    // Handle submenu items
    if (item.submenu) {
      return (
        <div
          className="relative group"
          onMouseEnter={() => {
            // Cancel any scheduled close and mark hovered
            if (submenuCloseTimer.current) {
              window.clearTimeout(submenuCloseTimer.current);
              submenuCloseTimer.current = null;
            }
            setHoveredIndex(index);
          }}
          onMouseLeave={() => {
            // Start a short timeout before closing to allow pointer to move into dropdown
            submenuCloseTimer.current = window.setTimeout(() => {
              // Only close if pointer not inside dropdown
              if (!submenuInside.current) setHoveredIndex(null);
              submenuCloseTimer.current = null;
            }, 100);
          }}
        >
          <button
            type="button"
            className={`button lg:text-lgButton transition flex items-center gap-1 ${
              isProjectsOrDetail || isAdminPage
                ? "text-white hover:text-white"
                : "text-gray hover:" + hoverTextColor
            }`}
          >
            <span>{item.title}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                hoveredIndex === index ? "rotate-180" : ""
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
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-3 w-80 rounded-lg border border-gray-200 bg-white shadow-xl z-50 overflow-hidden"
                onMouseEnter={() => {
                  // Pointer entered dropdown: cancel close and mark inside
                  submenuInside.current = true;
                  if (submenuCloseTimer.current) {
                    window.clearTimeout(submenuCloseTimer.current);
                    submenuCloseTimer.current = null;
                  }
                }}
                onMouseLeave={() => {
                  // Pointer left dropdown: schedule close
                  submenuInside.current = false;
                  submenuCloseTimer.current = window.setTimeout(() => {
                    setHoveredIndex(null);
                    submenuCloseTimer.current = null;
                  }, 100);
                }}
              >
                <div className="p-4 space-y-1">
                  {item.submenu.map((solution, idx) => (
                    <Link
                      key={idx}
                      href={solution.href}
                      className="flex items-start gap-3 p-3 rounded-lg transition group/item"
                    >
                      <div className="shrink-0 mt-1 w-10 h-10 rounded-full flex items-center justify-center">
                        <span
                          role="img"
                          aria-label={solution.alt || solution.title}
                          className="block w-8 h-8 bg-current text-gray-900 group-hover/item:text-[#c58d12] transition-colors"
                          style={maskStyle(solution.icon)}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover/item:text-[#c58d12] transition">
                          {solution.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {solution.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Regular nav item
    return (
      <Link
        key={item.path}
        href={item.path || "#"}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={`button lg:text-lgButton ${
          isProjectsOrDetail || isAdminPage
            ? "text-white hover:text-white"
            : "text-gray hover:" + hoverTextColor
        } relative group transition ${
          isActive(item.path || "") ? "font-bold underline" : ""
        }`}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <span className="relative">
          {hoveredIndex === index ? (
            <>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent transition-all duration-300 transform scale-x-100 group-hover:scale-x-0"></span>
              {item.title}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#c9184a] transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
            </>
          ) : (
            item.title
          )}
        </span>
      </Link>
    );
  };

  return (
    <NoiseBackground mode={noiseMode} intensity={0.1}>
      <div className={`w-full bg-transparent ${className}`}>
        <div className="relative pt-0 pb-0 px-7 md:pb-0">
          <div className="mx-auto w-full xl:container">
            <nav
              className={`flex items-center ${
                isAdminPage ? "justify-center" : "justify-between"
              }`}
            >
              <Link
                href="/"
                className={`button text-gray lg:text-lgButton transition hover:underline ${
                  isProjectsPage || isAdminPage
                    ? "hover:text-white"
                    : "hover:text-black"
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={
                      isProjectsPage || isAdminPage
                        ? "/ali-ramazan-yildirim-white.svg"
                        : "/ali-ramazan-yildirim.svg"
                    }
                    alt="Logo"
                    width={120}
                    height={80}
                    className="h-24 md:h-32 lg:h-48 w-auto opacity-100"
                  />
                </motion.div>
              </Link>

              {/* Admin-Seite: Nur Logo, keine Navigation - Admin page: Only logo, no navigation */}
              {!isAdminPage && (
                <>
                  <div className="hidden lg:flex space-x-8">
                    {navItems.map((item: any, index: number) => (
                      <NavItem
                        key={item.title}
                        item={item}
                        index={index}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                      />
                    ))}
                  </div>

                  <div
                    className="hidden lg:block relative"
                    onMouseEnter={() => {
                      if (langMenuCloseTimer.current) {
                        window.clearTimeout(langMenuCloseTimer.current);
                        langMenuCloseTimer.current = null;
                      }
                      setLanguageMenuOpen(true);
                    }}
                    onMouseLeave={() => {
                      langMenuCloseTimer.current = window.setTimeout(() => {
                        if (!langMenuInside.current) setLanguageMenuOpen(false);
                        langMenuCloseTimer.current = null;
                      }, 100);
                    }}
                  >
                    <button
                      className={`button lg:text-lgButton flex items-center gap-2 transition ${
                        isProjectsPage || isAdminPage
                          ? "text-white hover:text-white"
                          : "text-gray hover:text-black"
                      }`}
                      aria-haspopup="true"
                      aria-expanded={languageMenuOpen}
                      aria-label={navDictionary.aria.language}
                      type="button"
                    >
                      <Image
                        src={currentLanguageData.flag}
                        alt={`${currentLanguageLabel} flag`}
                        width={20}
                        height={14}
                        className="h-3.5 w-5 rounded-sm object-cover"
                      />
                      <span className="font-normal">
                        {currentLanguageLabel}
                      </span>
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
                          className="absolute right-0 top-full mt-2 w-40 rounded-md border border-none bg-[#dcdbd8]/20 py-2 shadow-lg backdrop-blur z-50 flex flex-col items-center"
                          onMouseEnter={() => {
                            langMenuInside.current = true;
                            if (langMenuCloseTimer.current) {
                              window.clearTimeout(langMenuCloseTimer.current);
                              langMenuCloseTimer.current = null;
                            }
                          }}
                          onMouseLeave={() => {
                            langMenuInside.current = false;
                            langMenuCloseTimer.current = window.setTimeout(
                              () => {
                                setLanguageMenuOpen(false);
                                langMenuCloseTimer.current = null;
                              },
                              100,
                            );
                          }}
                        >
                          {languages.map((lang) => (
                            <li key={lang.code}>
                              <button
                                type="button"
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full px-4 py-2 text-center text-sm transition ${
                                  language === lang.code
                                    ? "font-semibold text-[#c9184a]"
                                    : "text-gray-700"
                                } flex items-center gap-2 justify-center`}
                              >
                                <Image
                                  src={lang.flag}
                                  alt={`${lang.label} flag`}
                                  width={18}
                                  height={12}
                                  className="h-3 w-4 rounded-sm object-cover"
                                />
                                {lang.label}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    className={`lg:hidden inline-flex items-center justify-center rounded-full border px-3 py-2 shadow-sm backdrop-blur-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40 ${
                      isProjectsPage || isAdminPage
                        ? "border-white/30 bg-white/10 text-white hover:border-white/50"
                        : "border-gray-200/80 bg-white/70 text-gray hover:border-gray-300"
                    }`}
                    onClick={toggleMenu}
                    aria-label={navDictionary.aria.toggle}
                    aria-expanded={menuOpen}
                    type="button"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </nav>

            <AnimatePresence>
              {menuOpen && !isAdminPage && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
                    onClick={toggleMenu}
                  />
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={mobileMenuVariants}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="lg:hidden fixed inset-0 z-50 flex items-start justify-center px-4 py-6 sm:py-10 landscape:py-4 overflow-y-auto"
                    onClick={toggleMenu}
                  >
                    <div
                      className="relative w-full max-w-md landscape:max-w-3xl rounded-[28px] border border-white/70 bg-linear-to-b from-[#f7f5f0]/95 via-white/95 to-[#f0ece4]/95 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-lg overflow-hidden"
                      role="dialog"
                      aria-modal="true"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="absolute inset-x-0 top-3 flex justify-center">
                        <span className="h-1.5 w-10 rounded-full bg-black/10" />
                      </div>
                      <button
                        className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 p-2 text-gray shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40"
                        onClick={toggleMenu}
                        aria-label={navDictionary.aria.close}
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
                        {navItems.map((item: any) =>
                          item.submenu ? (
                            <li
                              key={item.title}
                              className="w-full flex flex-col items-center landscape:col-span-2"
                            >
                              <button
                                type="button"
                                className={`button lg:text-lgButton transition flex items-center justify-center gap-2 mx-auto w-full max-w-85 rounded-full border border-white/80 bg-white/70 px-5 py-3 text-center shadow-sm backdrop-blur-sm hover:border-[#c9184a]/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40 landscape:py-2.5 landscape:max-w-105 ${
                                  isProjectsPage
                                    ? "text-gray hover:text-[#c9184a]"
                                    : "text-gray hover:text-black"
                                }`}
                                onClick={() => setSolutionsOpen(!solutionsOpen)}
                              >
                                <span>{item.title}</span>
                                <svg
                                  className={`w-4 h-4 transition-transform ${
                                    solutionsOpen ? "rotate-180" : ""
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
                                {solutionsOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-3 grid gap-2 w-full max-w-105 rounded-2xl border border-white/80 bg-white/70 p-3 shadow-lg backdrop-blur-md overflow-hidden sm:grid-cols-2 landscape:mt-2 landscape:max-w-160"
                                  >
                                    {item.submenu.map(
                                      (solution: any, subIdx: number) => (
                                        <Link
                                          key={subIdx}
                                          href={solution.href}
                                          className="flex items-start gap-3 rounded-xl border border-transparent bg-white/70 p-3 transition group/item hover:border-[#c58d12]/40 hover:bg-white"
                                          onClick={() => {
                                            setMenuOpen(false);
                                            setSolutionsOpen(false);
                                          }}
                                        >
                                          <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#f1e8d1] flex items-center justify-center">
                                            <span
                                              role="img"
                                              aria-label={
                                                solution.alt || solution.title
                                              }
                                              className="block w-4 h-4 bg-current text-gray-900 group-hover/item:text-[#c58d12] transition-colors"
                                              style={maskStyle(solution.icon)}
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="text-xs font-semibold text-gray-900 group-hover/item:text-[#c58d12] transition">
                                              {solution.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-0.5">
                                              {solution.description}
                                            </p>
                                          </div>
                                        </Link>
                                      ),
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </li>
                          ) : (
                            <li
                              key={item.path}
                              className="w-full flex justify-center"
                            >
                              <Link
                                href={item.path || "#"}
                                target={item.external ? "_blank" : undefined}
                                rel={
                                  item.external
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className={`button lg:text-lgButton transition w-full max-w-85 rounded-full border border-white/80 bg-white/70 px-5 py-3 text-center shadow-sm backdrop-blur-sm hover:border-[#c9184a]/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40 landscape:py-2.5 landscape:max-w-75 ${
                                  isProjectsPage
                                    ? "text-gray hover:text-[#c9184a]"
                                    : "text-gray hover:text-black"
                                }`}
                                onClick={() => setMenuOpen(false)}
                              >
                                {item.title}
                              </Link>
                            </li>
                          ),
                        )}

                        <li className="w-full border-t border-black/10 pt-5 landscape:col-span-2 landscape:pt-4">
                          <div className="text-[11px] font-semibold text-gray/70 uppercase tracking-[0.35em] text-center">
                            {languageLabel}
                          </div>
                          <div className="mt-3 flex flex-col items-center gap-2 landscape:mt-2 landscape:flex-row landscape:flex-wrap landscape:justify-center">
                            {languages.map((lang) => (
                              <button
                                key={lang.code}
                                type="button"
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-56 max-w-[80vw] rounded-full border px-4 py-2.5 text-sm transition shadow-sm backdrop-blur-sm landscape:w-40 landscape:py-2 ${
                                  language === lang.code
                                    ? "border-[#c9184a] text-[#c9184a] bg-[#c9184a]/10"
                                    : "border-white/80 bg-white/70 text-gray-700 hover:border-gray-300"
                                } flex items-center gap-2 justify-center`}
                              >
                                <Image
                                  src={lang.flag}
                                  alt={`${lang.label} flag`}
                                  width={18}
                                  height={12}
                                  className="h-3 w-4 rounded-sm object-cover"
                                />
                                {lang.label}
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
          </div>
        </div>
      </div>
    </NoiseBackground>
  );
};

export default Nav;
