export type Locales = "en" | "de" | "tr";

export function getLocalizedText(
  desc: Record<Locales, string> | string,
  language: Locales
): string {
  if (typeof desc === "string") return desc;
  return desc[language] || desc.en || desc.de || desc.tr || "";
}
