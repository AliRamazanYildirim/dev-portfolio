"use client";

import React from "react";
import MarqueeItem from "@/components/ui/MarqueeItem";

const PartnersMarquee: React.FC = () => {
  const partners = [
    { src: "/logo.svg", text: "KARACA" },
    { src: "/logo.svg", text: "KARAKAYA" },
    { src: "/logo.svg", text: "CSIH" },
  ];

  return (
    <div className="container mx-auto md:px-28 mt-16">
      <MarqueeItem images={partners} from={"0%"} to={"-100%"} />
    </div>
  );
};

export default PartnersMarquee;
