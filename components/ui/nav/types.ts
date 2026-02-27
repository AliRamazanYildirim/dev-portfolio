import type { SupportedLanguage } from "@/contexts/LanguageContext";

export interface NavSubmenuItem {
  title: string;
  description: string;
  icon: string;
  alt?: string;
  href: string;
}

export interface NavItem {
  title: string;
  path?: string;
  external?: boolean;
  submenu?: readonly NavSubmenuItem[];
}

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
}
