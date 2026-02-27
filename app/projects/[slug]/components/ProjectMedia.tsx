import React from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  featured?: boolean;
  featuredLabel?: string;
}

export default function ProjectMedia({
  src,
  alt,
  featured = false,
  featuredLabel,
}: Props) {
  return (
    <div className="flex justify-center mb-16">
      <div className="relative w-full max-w-225">
        {featured && featuredLabel && (
          <span className="absolute right-0 -top-12 z-20 rounded-full border border-[#c58d12]/40 bg-[#c58d12]/10 px-4 py-2 text-sm font-bold text-[#c58d12] backdrop-blur-xs">
            {featuredLabel}
          </span>
        )}
        <div className="relative aspect-3/2 rounded-md overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 900px) 100vw, 900px"
          />
        </div>
      </div>
    </div>
  );
}
