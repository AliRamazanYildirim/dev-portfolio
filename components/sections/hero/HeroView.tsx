import type { HeroDictionary, HeroLocale } from "@/constants/translationsHero";
import {
  HeroContent,
  HeroFooter,
  PortraitColumn,
  SocialLinksBar,
} from "./HeroParts";

interface HeroViewProps {
  hero: HeroDictionary;
  language: HeroLocale;
  socialAriaPrefix: string;
  onOpenProcess: () => void;
  onScrollToAbout: () => void;
}

export function HeroView({
  hero,
  language,
  socialAriaPrefix,
  onOpenProcess,
  onScrollToAbout,
}: HeroViewProps) {
  return (
    <section
      id="hero"
      className="px-7 pb-12 md:pb-32 min-h-screen flex flex-col"
    >
      <div className="mx-auto w-full flex-1 flex flex-col justify-center xl:container">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-12 lg:gap-16 xl:gap-20">
          <HeroContent
            hero={hero}
            language={language}
            onOpenProcess={onOpenProcess}
          />
          <div className="hero-reveal hero-reveal-delay-1 w-full max-w-sm sm:max-w-md lg:max-w-107.5 xl:max-w-117.5">
            <PortraitColumn panel={hero.portraitPanel} />
          </div>
        </div>

        <HeroFooter
          locationLabel={hero.location}
          scrollLabel={hero.scrollLabel}
          onScrollToAbout={onScrollToAbout}
        />
        <SocialLinksBar ariaPrefix={socialAriaPrefix} />
      </div>
    </section>
  );
}
