"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { SupportedLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import NavDesktop from "./nav/NavDesktop";
import NavMobile from "./nav/NavMobile";
import { LANGUAGE_OPTIONS, NAV_HEIGHT } from "./nav/shared";
import type { NavItem } from "./nav/types";

interface NavProps {
  className?: string;
}

export const Nav = ({ className }: NavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, dictionary } = useTranslation();
  const navDictionary = dictionary.nav;

  const navItems = (navDictionary.items as readonly NavItem[]).filter(
    (item) => item.path !== "/admin/login",
  );
  const currentLanguage =
    LANGUAGE_OPTIONS.find((item) => item.code === language) ??
    LANGUAGE_OPTIONS[0];

  const isAdminPage = pathname.startsWith("/admin");

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((previous) => !previous);
  };

  const handleLanguageChange = (code: SupportedLanguage) => {
    setLanguage(code);
    closeMenu();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile menu when route changes
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className={`w-full bg-transparent ${className ?? ""}`}>
      <div className="relative pt-0 pb-0 px-7 md:pb-0">
        <div className="mx-auto w-full xl:container">
          <nav
            className={`flex items-center ${
              isAdminPage ? "justify-center" : "justify-between"
            }`}
            style={{ minHeight: NAV_HEIGHT }}
          >
            <Link
              href="/"
              className="button text-zinc-800 dark:text-white lg:text-lgButton transition hover:underline hover:text-zinc-800 dark:hover:text-white"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/ali-ramazan-yildirim.svg"
                  alt="Logo"
                  width={288}
                  height={192}
                  sizes="(max-width: 767px) 96px, (max-width: 1023px) 240px, 288px"
                  className="w-auto block transition-transform duration-300 hover:scale-110 dark:hidden"
                  style={{ height: NAV_HEIGHT }}
                  priority
                />
                <Image
                  src="/ali-ramazan-yildirim-white.svg"
                  alt="Logo"
                  width={288}
                  height={192}
                  sizes="(max-width: 767px) 96px, (max-width: 1023px) 240px, 288px"
                  className="w-auto hidden transition-transform duration-300 hover:scale-110 dark:block"
                  style={{ height: NAV_HEIGHT }}
                  priority
                />
              </motion.div>
            </Link>

            {!isAdminPage && (
              <>
                <NavDesktop
                  navItems={navItems}
                  pathname={pathname}
                  language={language}
                  languages={LANGUAGE_OPTIONS}
                  currentLanguage={currentLanguage}
                  languageAriaLabel={navDictionary.aria.language}
                  onLanguageChange={handleLanguageChange}
                />

                <button
                  className="lg:hidden relative -top-2 inline-flex items-center justify-center rounded-full border border-zinc-400/50 dark:border-white/30 bg-zinc-100/80 dark:bg-white/10 text-zinc-800 dark:text-white hover:border-zinc-500/70 dark:hover:border-white/50 px-3 py-2 shadow-sm backdrop-blur-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9184a]/40"
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

          {!isAdminPage && (
            <NavMobile
              menuOpen={menuOpen}
              navItems={navItems}
              languages={LANGUAGE_OPTIONS}
              language={language}
              languageLabel={navDictionary.languageMenu.label}
              closeAriaLabel={navDictionary.aria.close}
              onClose={closeMenu}
              onLanguageChange={handleLanguageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
