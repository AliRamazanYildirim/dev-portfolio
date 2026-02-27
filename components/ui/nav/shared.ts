import type { CSSProperties } from "react";
import type { Variants } from "framer-motion";
import type { LanguageOption } from "./types";

export const NAV_HEIGHT = "clamp(6rem, calc(25vw - 4rem), 12rem)";

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    code: "en",
    label: "English",
    flag: "/flags/us.svg",
  },
  {
    code: "de",
    label: "Deutsch",
    flag: "/flags/de.svg",
  },
  {
    code: "tr",
    label: "Türkçe",
    flag: "/flags/tr.svg",
  },
  {
    code: "fr",
    label: "Français",
    flag: "/flags/fr.svg",
  },
];

export const MOBILE_MENU_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

export const getIconMaskStyle = (icon: string): CSSProperties => ({
  maskImage: `url(${icon})`,
  maskRepeat: "no-repeat",
  maskPosition: "center",
  maskSize: "contain",
  WebkitMaskImage: `url(${icon})`,
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  WebkitMaskSize: "contain",
});
