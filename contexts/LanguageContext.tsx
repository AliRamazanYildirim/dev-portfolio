"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { translations } from "@/constants/translations";

export type SupportedLanguage = "en" | "de" | "tr" | "fr";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (path: string) => string;
  raw: (typeof translations)[SupportedLanguage];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const DEFAULT_LANGUAGE: SupportedLanguage = "de";
const STORAGE_KEY = "preferred-language";
const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  "en",
  "de",
  "tr",
  "fr",
];

const isSupportedLanguage = (value: string): value is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);

// Lies das localStorage als externes System.
const listeners = new Set<() => void>();

function subscribeToLanguage(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getLanguageSnapshot(): SupportedLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isSupportedLanguage(stored)) return stored;
  return DEFAULT_LANGUAGE;
}

function getLanguageServerSnapshot(): SupportedLanguage {
  return DEFAULT_LANGUAGE;
}

function setStoredLanguage(lang: SupportedLanguage): void {
  localStorage.setItem(STORAGE_KEY, lang);
  // Benachrichtige alle Abonnenten
  listeners.forEach((cb) => cb());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot,
  );

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setStoredLanguage(lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
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
  }, [language, setLanguage]);

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
