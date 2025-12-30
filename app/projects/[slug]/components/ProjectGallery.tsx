import React from "react";
import Image from "next/image";
import type { ProjectImage } from "../types";

interface Props {
  gallery: ProjectImage[];
  title: string;
  heading?: string;
}

export default function ProjectGallery({ gallery, title, heading }: Props) {
  if (!gallery || gallery.length === 0) return null;

  const sorted = [...gallery].sort((a, b) => a.order - b.order);

  return (
    <div className="mb-16">
      <h2 className="heading md:text-lgHeading mb-6">{heading || "Gallery"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((image, idx) => (
          <div
            key={image.id ?? `${image.url}-${idx}`}
            className="relative w-full aspect-[3/2] rounded-md overflow-hidden"
          >
            <Image
              src={image.url}
              alt={image.alt || `${title} screenshot`}
              fill
              className="object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
