import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface MarqueeItemProps {
  images: { src: string; text: string }[];
  from: string;
  to: string;
}

const MarqueeItem: React.FC<MarqueeItemProps> = ({ images, from, to }) => {
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
        className="md:w-20 md:h-20"
      />
      <span className="text-sm md:text-lg text-white text-center font-bold">
        {item.text}
      </span>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      {/* Maskierter Verlauf nur im Hintergrund*/}
      <div className="absolute inset-0 pointer-events-none MyGradient z-0" />

      {/* Inhalt in separater Schicht*/}
      <div className="relative z-10 flex">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: `${from}` }}
            animate={{ x: `${to}` }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex flex-shrink-0"
          >
            {images.map((item, index) => renderItem(item, index))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeItem;
