"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { footerItems } from "@/data";
import { ShimmerButton } from "@/components/registry/magicui/ShimmerButton";
import {
  heroTranslations,
  type HeroDictionary,
} from "@/constants/translationsHero";
import { useTranslation } from "@/hooks/useTranslation";

const ProcessExperienceModal = dynamic(
  () => import("@/components/sections/ProcessExperienceModal"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function Hero() {
  const { dictionary, language } = useTranslation();
  const heroDictionary = heroTranslations[language];
  const footerDictionary = dictionary.footer;
  const [isProcessOpen, setIsProcessOpen] = useState(false);

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenProcess = () => setIsProcessOpen(true);
  const handleCloseProcess = () => setIsProcessOpen(false);

  return (
    <section
      id="hero"
      className="px-7 pb-12 md:pb-32 min-h-screen flex flex-col"
    >
      <div className="mx-auto w-full flex-1 flex flex-col justify-center xl:container">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-12 lg:gap-16 xl:gap-20">
          <HeroContent
            hero={heroDictionary}
            onOpenProcess={handleOpenProcess}
          />
          <div className="hero-reveal hero-reveal-delay-1 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <Portrait />
          </div>
        </div>

        <HeroFooter
          locationLabel={heroDictionary.location}
          scrollLabel={heroDictionary.scrollLabel}
          onScrollToAbout={handleScrollToAbout}
        />
        <SocialLinksBar ariaPrefix={footerDictionary.socialAriaPrefix} />
      </div>
      {heroDictionary.processModal && isProcessOpen && (
        <ProcessExperienceModal
          open={isProcessOpen}
          onClose={handleCloseProcess}
          content={heroDictionary.processModal}
        />
      )}
    </section>
  );
}

const HeroContent = ({
  hero,
  onOpenProcess,
}: {
  hero: HeroDictionary;
  onOpenProcess: () => void;
}) => {
  const { language } = useTranslation();
  const {
    tagline,
    headline,
    subheadline,
    introParagraphs,
    valueProps,
    ctas,
    trustNote,
  } = hero;
  const leadingLines =
    language === "de" && headline.leading
      ? ["Mehr passende Anfragen und Talente", "dank einer"]
      : headline.leading
        ? [headline.leading]
        : [];

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
              shimmerColor="#c58d12"
              shimmerDuration="6s"
              className="min-w-0 flex-1 h-auto min-h-12 px-5 sm:px-8 py-3 flex items-center justify-center rounded-full border border-[#c58d12] shadow-lg hover:bg-[#fff7e6] transition bg-white"
            >
              <span className="text-center text-sm sm:text-base leading-snug font-semibold tracking-tight text-black text-balance">
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

const Portrait = () => (
  <Image
    alt="Portrait of Ali Ramazan"
    src="/me.webp"
    width={408}
    height={488}
    sizes="(max-width: 768px) 80vw, 408px"
    className="block rounded-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-cover"
    style={{ aspectRatio: "408 / 488" }}
    priority
    fetchPriority="high"
  />
);

const ValueGrid = ({
  items,
}: {
  items: NonNullable<HeroDictionary["valueProps"]>;
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {items.map((item) => (
      <div
        key={item.title}
        className="h-full rounded-2xl border border-[#f2ddad] bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <p className="text-lg font-semibold text-[#20140d]">{item.title}</p>
        <p className="mt-2 text-sm md:text-base text-[#4a3625]">
          {item.description}
        </p>
      </div>
    ))}
  </div>
);

const HeroFooter = ({
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

const SocialLinksBar = ({ ariaPrefix }: { ariaPrefix: string }) => (
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
