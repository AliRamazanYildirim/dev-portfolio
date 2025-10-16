"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations } from "@/constants/translations";

export type SupportedLanguage = "en" | "de" | "tr";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (path: string) => string;
  raw: (typeof translations)[SupportedLanguage];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const DEFAULT_LANGUAGE: SupportedLanguage = "en";
const STORAGE_KEY = "preferred-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored && (stored === "en" || stored === "de" || stored === "tr")) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const dictionary = translations[language];

    const t = (path: string): string => {
      const segments = path.split(".");
      let current: any = dictionary;
      for (const segment of segments) {
        if (current && typeof current === "object" && segment in current) {
          current = current[segment];
        } else {
          return path;
        }
      }
      if (typeof current === "string") {
        return current;
      }
      return path;
    };

    return {
      language,
      setLanguage,
      t,
      raw: dictionary,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }
  return context;
}
