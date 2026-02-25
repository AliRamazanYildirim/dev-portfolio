import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ShimmerButton } from "@/components/registry/magicui/ShimmerButton";
import type { HeroDictionary, HeroLocale } from "@/constants/translationsHero";
import { footerItems } from "@/data";
import {
  PREMIUM_SURFACE_BASE,
  PREMIUM_SURFACE_OVERLAY,
  PREMIUM_SURFACE_PRIMARY_GLOW,
  PREMIUM_SURFACE_SECONDARY_GLOW,
  PREMIUM_SURFACE_TOP_LINE,
  type PremiumSurfaceVariant,
  premiumSurfaceVariantStyles,
} from "./HeroStyles";

interface HeroContentProps {
  hero: HeroDictionary;
  language: HeroLocale;
  onOpenProcess: () => void;
}

const getLeadingHeadlineLines = (
  leading: HeroDictionary["headline"]["leading"],
  language: HeroLocale,
) => {
  if (language === "de" && leading) {
    return ["Mehr passende Anfragen und Talente", "dank einer"];
  }

  if (language === "fr" && leading) {
    const match = leading.match(/^(.*?)(\s+et votre [ée]quipe avec un)$/i);
    if (match) {
      return [match[1].trim(), match[2].trim()];
    }
  }

  return leading ? [leading] : [];
};

export const HeroContent = ({ hero, language, onOpenProcess }: HeroContentProps) => {
  const {
    tagline,
    headline,
    subheadline,
    introParagraphs,
    valueProps,
    ctas,
    trustNote,
  } = hero;
  const leadingLines = getLeadingHeadlineLines(headline.leading, language);

  return (
    <div className="flex-1 space-y-8 text-[#260a03]">
      <div className="hero-reveal space-y-6">
        {tagline && (
          <span className="mt-8 inline-flex items-center rounded-full bg-[#c58d12] px-4 py-1 text-xs md:text-sm font-medium uppercase tracking-[0.45em] text-[#1a0f00]">
            {tagline}
          </span>
        )}

        <div className="space-y-4">
          {leadingLines.length > 0 && (
            <h1 className="space-y-1">
              {leadingLines.map((line, index) => (
                <HeadlineLine
                  key={`${line}-${index}`}
                  text={line}
                  className="text-lg sm:text-xl md:text-[32px] lg:text-[40px] font-light uppercase tracking-tight leading-tight sm:leading-snug md:leading-snug"
                />
              ))}
            </h1>
          )}
          {headline.highlight && (
            <HeadlineLine
              text={headline.highlight}
              className="text-xl sm:text-2xl md:text-title lg:text-[46px] font-semibold uppercase tracking-tight text-[#c58d12] leading-tight sm:leading-snug md:leading-snug"
            />
          )}
          {headline.trailing && (
            <HeadlineLine
              text={headline.trailing}
              className="text-xl sm:text-2xl md:text-title lg:text-[42px] font-light uppercase tracking-tight leading-tight sm:leading-snug md:leading-snug"
            />
          )}
        </div>

        {subheadline && (
          <p className="text-base md:text-lg text-[#4a3625]">{subheadline}</p>
        )}
      </div>

      {Array.isArray(introParagraphs) && introParagraphs.length > 0 && (
        <div className="space-y-4 text-base md:text-lg leading-relaxed text-[#3a2a1c]">
          {introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      {Array.isArray(valueProps) && valueProps.length > 0 && (
        <ValueGrid items={valueProps} />
      )}

      {(ctas?.primary || ctas?.secondary) && (
        <div className="flex flex-row gap-3 pt-4">
          {ctas?.primary && (
            <Link
              href={ctas.primary.href}
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full bg-black px-5 sm:px-8 py-3 text-sm md:text-base font-semibold text-white transition hover:bg-[#1a1a1a]"
            >
              {ctas.primary.label}
            </Link>
          )}
          {ctas?.secondary && (
            <ShimmerButton
              onClick={onOpenProcess}
              shimmerColor="rgba(216,176,106,0.55)"
              shimmerDuration="6s"
              className="min-w-0 flex-1 h-auto min-h-12 px-5 sm:px-8 py-3 flex items-center justify-center rounded-full border border-[#e2c48d]/80 bg-linear-to-br from-[#fffefb]/98 via-[#fff9ee]/96 to-[#f9edd2]/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_30px_rgba(36,12,2,0.1)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_20px_36px_rgba(36,12,2,0.14)]"
            >
              <span className="text-center text-sm sm:text-base leading-snug font-semibold tracking-tight text-[#2f1d0e] text-balance">
                {ctas.secondary.label}
              </span>
            </ShimmerButton>
          )}
        </div>
      )}

      {trustNote && (
        <p className="text-sm md:text-base text-[#8b6f4d]">{trustNote}</p>
      )}
    </div>
  );
};

const HeadlineLine = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => <span className={`block ${className}`}>{text}</span>;

const PremiumSurface = ({
  children,
  variant,
  className,
}: {
  children: ReactNode;
  variant: PremiumSurfaceVariant;
  className?: string;
}) => {
  const styles = premiumSurfaceVariantStyles[variant];

  return (
    <div
      className={[PREMIUM_SURFACE_BASE, styles.container, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={PREMIUM_SURFACE_OVERLAY} />
      <div
        className={`${PREMIUM_SURFACE_PRIMARY_GLOW} ${styles.primaryGlow}`}
      />
      <div
        className={`${PREMIUM_SURFACE_SECONDARY_GLOW} ${styles.secondaryGlow}`}
      />
      <div className={`${PREMIUM_SURFACE_TOP_LINE} ${styles.topLine}`} />
      <div className="relative">{children}</div>
    </div>
  );
};

const Portrait = () => (
  <Image
    alt="Portrait of Ali Ramazan"
    src="/me.webp"
    width={408}
    height={488}
    sizes="(max-width: 768px) 80vw, 408px"
    className="block w-full h-auto rounded-md object-cover"
    style={{ aspectRatio: "408 / 488" }}
    priority
    fetchPriority="high"
  />
);

export const PortraitColumn = ({
  panel,
}: {
  panel: HeroDictionary["portraitPanel"];
}) => (
  <div className="flex h-full flex-col-reverse gap-4 sm:gap-5 lg:flex-col">
    <Portrait />
    {panel && <PortraitPanel panel={panel} />}
  </div>
);

const PortraitPanel = ({
  panel,
}: {
  panel: NonNullable<HeroDictionary["portraitPanel"]>;
}) => (
  <PremiumSurface variant="panel" className="lg:mt-5 xl:mt-8">
    <span className="inline-flex items-center rounded-full border border-[#ddb76f]/45 bg-[#fffbef] px-3 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.26em] sm:tracking-[0.35em] text-[#946d27] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      {panel.badge}
    </span>
    <h3 className="mt-4 text-lg md:text-xl font-semibold leading-snug text-[#1b1007] text-balance">
      {panel.title}
    </h3>
    <p className="mt-2 text-sm md:text-base leading-relaxed text-[#4a3625] text-balance">
      {panel.summary}
    </p>

    <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-2.5">
      {panel.stats.map((stat) => (
        <div
          key={`${stat.value}-${stat.label}`}
          className="min-w-0 rounded-[18px] sm:rounded-2xl border border-[#ecd3a8] bg-linear-to-br from-[#fffefb] to-[#fdf2db]/90 px-2.5 sm:px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_18px_rgba(79,46,7,0.06)]"
        >
          <p className="text-base sm:text-lg font-semibold leading-none text-[#25160c]">
            {stat.value}
          </p>
          <p className="mt-1 text-[10px] sm:text-[11px] leading-tight text-[#72563a] text-balance">
            {stat.label}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-5 space-y-2.5 sm:space-y-3">
      {panel.bullets.map((bullet) => (
        <p
          key={bullet}
          className="flex items-start gap-2 text-sm leading-relaxed text-[#362415] text-balance"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9a84d] shadow-[0_0_8px_rgba(217,168,77,0.55)]" />
          <span>{bullet}</span>
        </p>
      ))}
    </div>
  </PremiumSurface>
);

const ValueGrid = ({
  items,
}: {
  items: NonNullable<HeroDictionary["valueProps"]>;
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {items.map((item) => (
      <PremiumSurface key={item.title} variant="card">
        <p className="text-lg font-semibold leading-snug text-[#20140d]">
          {item.title}
        </p>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-[#4a3625]">
          {item.description}
        </p>
      </PremiumSurface>
    ))}
  </div>
);

export const HeroFooter = ({
  locationLabel,
  scrollLabel,
  onScrollToAbout,
}: {
  locationLabel: string;
  scrollLabel: string;
  onScrollToAbout: () => void;
}) => (
  <div className="mt-12 border-t border-[#dbae4c] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#260a03]">
    <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#8b6f4d]">
      {locationLabel}
    </span>
    <button
      type="button"
      onClick={onScrollToAbout}
      className="flex items-center gap-2 text-sm md:text-base font-semibold text-[#260a03] transition hover:text-[#c58d12]"
    >
      <span>{scrollLabel}</span>
      <span className="hero-bounce inline-flex">
        <Image
          src="/icons/arrowdown.svg"
          alt="Arrow Down Icon for scrolling"
          width={16}
          height={16}
          className="md:w-4 md:h-4 lg:w-5 lg:h-5"
        />
      </span>
    </button>
  </div>
);

export const SocialLinksBar = ({ ariaPrefix }: { ariaPrefix: string }) => (
  <div className="mt-10 flex flex-nowrap items-center gap-1 md:gap-5 lg:gap-10 overflow-x-auto md:overflow-visible text-[#260a03]">
    {footerItems.map((item) => {
      const isExternal = item.path.startsWith("http");
      const isPdf = item.path.endsWith(".pdf");

      return (
        <Link
          key={item.path}
          href={item.path}
          target={isExternal || isPdf ? "_blank" : undefined}
          rel={isExternal || isPdf ? "noopener noreferrer" : undefined}
          prefetch={isPdf ? false : undefined}
          aria-label={`${ariaPrefix} ${item.title}`}
          className="group flex items-center gap-0.5 lg:gap-4 text-sm md:text-base lg:text-2xl font-medium transition hover:text-[#c58d12] shrink-0 whitespace-nowrap"
        >
          <Image
            src={item.icon}
            alt={`${item.title} icon`}
            width={30}
            height={30}
            className="w-7 h-7 md:w-8 md:h-8 lg:w-12 lg:h-12 transition group-hover:scale-105"
          />
          <span>{item.title}</span>
        </Link>
      );
    })}
  </div>
);
