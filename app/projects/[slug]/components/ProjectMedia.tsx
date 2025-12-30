import React from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function ProjectMedia({ src, alt }: Props) {
  return (
    <div className="flex justify-center mb-16">
      <div className="relative w-full max-w-[900px] aspect-[3/2] rounded-md overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 900px) 100vw, 900px"
        />
      </div>
    </div>
  );
}
