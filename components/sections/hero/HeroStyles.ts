export type PremiumSurfaceVariant = "panel" | "card";

export const PREMIUM_SURFACE_BASE =
  "group relative overflow-hidden border border-zinc-700/60 bg-linear-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 backdrop-blur-md transition-all duration-500 hover:border-[#c58d12]/40";
export const PREMIUM_SURFACE_OVERLAY =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(197,141,18,0.06),transparent_58%)] opacity-80";
export const PREMIUM_SURFACE_PRIMARY_GLOW =
  "pointer-events-none absolute rounded-full bg-[#c58d12]/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100";
export const PREMIUM_SURFACE_SECONDARY_GLOW =
  "pointer-events-none absolute rounded-full bg-[#c58d12]/10 blur-3xl";
export const PREMIUM_SURFACE_TOP_LINE =
  "pointer-events-none absolute h-px bg-linear-to-r from-transparent via-[#c58d12]/50 to-transparent";

export const premiumSurfaceVariantStyles: Record<
  PremiumSurfaceVariant,
  {
    container: string;
    primaryGlow: string;
    secondaryGlow: string;
    topLine: string;
  }
> = {
  panel: {
    container:
      "rounded-[24px] p-4 sm:rounded-[28px] sm:p-5 shadow-[0_20px_46px_rgba(36,12,2,0.14)] md:hover:-translate-y-1 md:hover:shadow-[0_28px_64px_rgba(36,12,2,0.2)]",
    primaryGlow: "-right-16 -top-20 h-56 w-56",
    secondaryGlow: "-left-16 bottom-0 h-40 w-40",
    topLine: "inset-x-8 top-0",
  },
  card: {
    container:
      "h-full rounded-[22px] p-4 sm:rounded-[26px] sm:p-5 shadow-[0_14px_32px_rgba(36,12,2,0.09)] md:hover:-translate-y-1.5 md:hover:shadow-[0_24px_50px_rgba(36,12,2,0.16)]",
    primaryGlow: "-right-10 -top-12 h-36 w-36",
    secondaryGlow: "-left-10 bottom-0 h-24 w-24",
    topLine: "inset-x-10 top-0",
  },
};
