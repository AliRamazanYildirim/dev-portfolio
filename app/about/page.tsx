"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import NoiseBackground from "@/components/NoiseBackground";
import SplitText from "@/TextAnimations/SplitText";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationDictionary } from "@/constants/translations";

const AboutPage = () => {
  const { dictionary } = useTranslation();
  const aboutDictionary = dictionary.aboutPage;

  return (
    <NoiseBackground mode="light" intensity={0.1}>
      <div className="relative min-h-screen overflow-hidden">
        <motion.section
          className="px-5 md:pb-20 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              <motion.div
                className="md:col-span-8 pb-5 md:pb-40"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Header lines={aboutDictionary.headline} />
                <Paragraph text={aboutDictionary.quote} />
              </motion.div>

              <motion.div
                className="md:col-span-4 pb-10 flex justify-center md:justify-end"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                <Portrait />
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              >
                <Header2 text={aboutDictionary.sectionHeading} />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-8">
                {aboutDictionary.interests.map((interest, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col space-y-2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.6 + index * 0.1,
                    }}
                  >
                    <Interest data={interest} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </NoiseBackground>
  );
};

const Header = ({
  lines,
}: {
  lines: TranslationDictionary["aboutPage"]["headline"];
}) => {
  const lineClasses = [
    "block text-4xl md:text-8xl xl:text-[6.5rem]",
    "block text-4xl md:text-8xl xl:text-[6.5rem]",
    "block pl-12 md:pl-32 text-4xl md:text-8xl xl:text-[6.5rem]",
    "block pl-12 md:pl-10 text-4xl md:text-8xl xl:text-[6.5rem]",
  ];

  return (
    <header className="title pb-5 md:pb-20">
      {lines.map((line, index) => (
        <h1
          key={`${line}-${index}`}
          className={lineClasses[index] ?? lineClasses[0]}
        >
          <SplitText text={line} />
        </h1>
      ))}
    </header>
  );
};

const Paragraph = ({ text }: { text: string }) => (
  <p className="content md:text-lgContent text-gray italic">{text}</p>
);

const Portrait = () => (
  <Image
    alt="Portrait of Ali Ramazan"
    src="/me.webp"
    width={408}
    height={488}
    sizes="(max-width: 768px) 80vw, 408px"
    className="rounded-md"
  />
);

const Header2 = ({ text }: { text: string }) => (
  <h2 className="heading md:text-lgHeading md:pb-10">
    <SplitText text={text} />
  </h2>
);

const Interest = ({
  data,
}: {
  data: TranslationDictionary["aboutPage"]["interests"][number];
}) => (
  <div>
    <div className="flex items-center space-x-2">
      <Image
        src={data.icon}
        alt={data.alt}
        width={16}
        height={16}
        className="md:w-8 md:h-8"
      />
      <h3 className="content2 text-gray md:text-lgContent2">{data.title}</h3>
    </div>

    <p className="content3 md:text-lgContent3">{data.description}</p>
  </div>
);

export default AboutPage;
