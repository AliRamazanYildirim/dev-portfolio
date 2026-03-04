import React from "react";
import Image from "next/image";

interface MarqueeItemProps {
  images: { src: string; text: string }[];
  from?: string;
  to?: string;
}

const MarqueeItem: React.FC<MarqueeItemProps> = ({ images }) => {
  const renderItem = (item: { src: string; text: string }, index: number) => (
    <div
      key={index}
      className="flex items-center justify-center space-x-2 pr-10 h-20 md:h-40 w-fit rounded-xl m-4 px-4"
      style={{ borderRadius: "1rem" }}
    >
      <Image
        src={item.src}
        alt={item.text || `Icon ${index + 1}`}
        width={40}
        height={40}
        className={`md:w-20 md:h-20${item.src === "/techStack/expressjs.svg" ? " dark:brightness-0 dark:invert" : item.src === "/techStack/github.svg" ? " brightness-0 dark:invert" : ""}`}
      />
      <span className="text-sm md:text-lg text-zinc-700 dark:text-white text-center font-bold">
        {item.text}
      </span>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      {/* Maskierter Verlauf nur im Hintergrund */}
      <div className="absolute inset-0 pointer-events-none MyGradient z-0" />

      {/* Inhalt in separater Schicht – reine CSS-Animation */}
      <div className="relative z-10 flex">
        {[0, 1].map((i) => (
          <div key={i} className="marquee-track">
            {images.map((item, index) => renderItem(item, index))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeItem;
