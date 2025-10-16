import { useLanguageContext, type SupportedLanguage } from "@/contexts/LanguageContext";
import type { TranslationDictionary } from "@/constants/translations";

interface UseTranslationResult {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (path: string) => string;
  dictionary: TranslationDictionary;
}

export function useTranslation(): UseTranslationResult {
  const { language, setLanguage, t, raw } = useLanguageContext();
  return { language, setLanguage, t, dictionary: raw };
}
