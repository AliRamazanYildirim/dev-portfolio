import React from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt?: string;
  sizes?: string;
  className?: string;
}

export default function ProjectImage({
  src,
  alt = "",
  sizes,
  className = "",
}: Props) {
  return (
    <div className="relative w-full max-w-[900px] aspect-[3/2] rounded-md overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain hover:scale-105 transition-transform duration-300 ${className}`}
        sizes={sizes || "(max-width: 900px) 100vw, 900px"}
      />
    </div>
  );
}
