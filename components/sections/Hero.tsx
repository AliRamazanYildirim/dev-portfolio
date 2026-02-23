"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { HeroView } from "@/components/sections/hero/HeroView";
import { heroTranslations } from "@/constants/translationsHero";
import { useTranslation } from "@/hooks/useTranslation";

const ProcessExperienceModal = dynamic(
  () => import("@/components/sections/ProcessExperienceModal"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function HeroContainer() {
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

  return (
    <>
      <HeroView
        hero={heroDictionary}
        language={language}
        socialAriaPrefix={footerDictionary.socialAriaPrefix}
        onOpenProcess={() => setIsProcessOpen(true)}
        onScrollToAbout={handleScrollToAbout}
      />
      {heroDictionary.processModal && isProcessOpen && (
        <ProcessExperienceModal
          open={isProcessOpen}
          onClose={() => setIsProcessOpen(false)}
          content={heroDictionary.processModal}
        />
      )}
    </>
  );
}
