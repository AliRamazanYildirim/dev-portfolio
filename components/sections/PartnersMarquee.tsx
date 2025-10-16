"use client";

import React from "react";
import MarqueeItem from "@/components/ui/MarqueeItem";
import SplitText from "@/TextAnimations/SplitText";
import { useTranslation } from "@/hooks/useTranslation";

const PartnersMarquee: React.FC = () => {
  const { dictionary } = useTranslation();
  const partnersTexts = dictionary.partners;

  const partners = [
    { src: "/partners/karaca.png", text: "KARACA" },
    { src: "/logo.svg", text: "KARAKAYA" },
    { src: "/logo.svg", text: "CSIH" },
  ];

  return (
    <div className="container mx-auto md:px-28 mt-16">
      {/* Kreativer Titelbereich */}
      <div className="text-center mb-8 md:mb-12">
        <span className="uppercase tracking-[0.5em] font-semibold text-sm md:text-base lg:text-lg text-white/90">
          {partnersTexts.strapline}
        </span>

        <div className="w-full flex justify-center">
          <h2 className="title md:text-lgHeading font-extrabold mt-2 text-white w-fit">
            <SplitText text={partnersTexts.heading} />
          </h2>
        </div>
      </div>

      <MarqueeItem images={partners} from={"0%"} to={"-100%"} />
    </div>
  );
};

export default PartnersMarquee;
