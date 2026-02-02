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
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
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
                      <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-full flex items-center justify-center">
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
        <div className="relative pt-0 pb-0 px-7 md:px-24 md:pb-0">
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

                <div className="hidden lg:block relative">
                  <button
                    className={`button lg:text-lgButton flex items-center gap-2 transition ${
                      isProjectsPage || isAdminPage
                        ? "text-white hover:text-white"
                        : "text-gray hover:text-black"
                    }`}
                    onClick={toggleLanguageMenu}
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
                    <span className="font-normal">{currentLanguageLabel}</span>
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
                  className="lg:hidden text-gray focus:outline-none"
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
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={toggleMenu}
                />
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={mobileMenuVariants}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50"
                >
                  <button
                    className="absolute top-4 right-4 text-gray focus:outline-none"
                    onClick={toggleMenu}
                    aria-label={navDictionary.aria.close}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <ul className="flex flex-col items-center w-full gap-4 py-6 px-6">
                    {navItems.map((item: any, idx: number) =>
                      item.submenu ? (
                        <li
                          key={item.title}
                          className="w-full flex flex-col items-center"
                        >
                          <button
                            type="button"
                            className={`button lg:text-lgButton ${
                              isProjectsPage
                                ? "text-gray hover:text-[#c9184a]"
                                : "text-gray hover:text-black"
                            } transition flex items-center justify-center gap-2 mx-auto`}
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
                                className="mt-3 space-y-2 overflow-hidden"
                              >
                                {item.submenu.map(
                                  (solution: any, subIdx: number) => (
                                    <Link
                                      key={subIdx}
                                      href={solution.href}
                                      className="flex items-start gap-2 p-2 rounded-md transition group/item"
                                      onClick={() => {
                                        setMenuOpen(false);
                                        setSolutionsOpen(false);
                                      }}
                                    >
                                      <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full bg-[#c58d12]/40 flex items-center justify-center">
                                        <span
                                          role="img"
                                          aria-label={solution.alt || solution.title}
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
                                  )
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
                              item.external ? "noopener noreferrer" : undefined
                            }
                            className={`button lg:text-lgButton ${
                              isProjectsPage
                                ? "text-gray hover:text-[#c9184a]"
                                : "text-gray hover:text-black"
                            } transition`}
                            onClick={() => setMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      )
                    )}

                    <li className="w-full border-t border-gray/20 pt-4">
                      <div className="text-sm text-gray uppercase tracking-wide mb-2">
                        {languageLabel}
                      </div>
                      <div className="flex flex-col gap-2">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full rounded-md border px-4 py-2 text-sm transition ${
                              language === lang.code
                                ? "border-[#c9184a] text-[#c9184a] bg-[#c9184a]/10"
                                : "border-gray-200 text-gray hover:border-gray-400"
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
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </NoiseBackground>
  );
};

export default Nav;
