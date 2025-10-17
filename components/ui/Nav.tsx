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
  path: string;
  external?: boolean;
}

export const Nav = ({ className }: { className?: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, dictionary } = useTranslation();
  const navDictionary = dictionary.nav;

  const navItems = navDictionary.items;
  const languageLabel = navDictionary.languageMenu.label;
  const languages = [
    {
      code: "en" as SupportedLanguage,
      label: navDictionary.languageMenu.languages.en,
    },
    {
      code: "de" as SupportedLanguage,
      label: navDictionary.languageMenu.languages.de,
    },
    {
      code: "tr" as SupportedLanguage,
      label: navDictionary.languageMenu.languages.tr,
    },
  ];
  const currentLanguageLabel = navDictionary.languageMenu.languages[language];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setLanguageMenuOpen(false);
  };

  useEffect(() => {
    setLanguageMenuOpen(false);
    setMenuOpen(false);
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

    return (
      <Link
        key={item.path}
        href={item.path}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={`button lg:text-lgButton ${
          isProjectsOrDetail || isAdminPage
            ? "text-white hover:text-white"
            : "text-gray hover:" + hoverTextColor
        } relative group transition ${
          isActive(item.path) ? "font-bold underline" : ""
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
                  priority
                />
              </motion.div>
            </Link>

            {/* Admin-Seite: Nur Logo, keine Navigation - Admin page: Only logo, no navigation */}
            {!isAdminPage && (
              <>
                <div className="hidden lg:flex space-x-8">
                  {navItems.map((item: NavItemType, index: number) => (
                    <NavItem
                      key={item.path}
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
                        className="absolute right-0 top-full mt-2 w-40 rounded-md border border-none bg-white/90 py-2 shadow-lg backdrop-blur z-50 flex flex-col items-center"
                      >
                        {languages.map((lang) => (
                          <li key={lang.code}>
                            <button
                              type="button"
                              onClick={() => handleLanguageChange(lang.code)}
                              className={`w-full px-4 py-2 text-center text-sm transition hover:bg-gray-100 ${
                                language === lang.code
                                  ? "font-semibold text-[#c9184a]"
                                  : "text-gray-700"
                              }`}
                            >
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
                  <ul className="flex flex-col items-center space-y-4 py-4 px-6">
                    {navItems.map((item: NavItemType) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
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
                    ))}
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
                            }`}
                          >
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
