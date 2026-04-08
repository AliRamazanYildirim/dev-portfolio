"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SplitText from "@/components/animations/SplitText";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationDictionary } from "@/constants/translations";

const AboutPage = () => {
  const { dictionary, language } = useTranslation();
  const aboutDictionary = dictionary.aboutPage;

  return (
    <div className="relative min-h-screen">
      <motion.section
        className="px-5 md:pb-20 relative z-10 text-zinc-900 dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <motion.div
              className="md:col-span-8 pb-5 md:pb-20"
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
              <Header2
                text={aboutDictionary.sectionHeading}
                isTurkish={language === "tr"}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-8">
              {aboutDictionary.interests.map((interest, index) => (
                <motion.div
                  key={interest.title}
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
  );
};

const Header = ({
  lines,
}: {
  lines: TranslationDictionary["aboutPage"]["headline"];
}) => {
  const lineClasses = [
    "block text-[1.35rem] sm:text-[2.7rem] lg:text-[5.4rem] xl:text-[5.85rem]",
    "block text-[1.35rem] sm:text-[2.7rem] lg:text-[5.4rem] xl:text-[5.85rem]",
    "block pl-12 md:pl-32 text-[1.69rem] sm:text-[2.7rem] lg:text-[5.4rem] xl:text-[5.85rem]",
    "block pl-12 md:pl-10 text-[1.69rem] sm:text-[2.7rem] lg:text-[5.4rem] xl:text-[5.85rem]",
  ];

  return (
    <header className="title pb-5 md:pb-5">
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
  <p className="content sm:text-lg lg:text-lgContent text-zinc-500 dark:text-zinc-300 italic">
    {text}
  </p>
);

const Portrait = () => (
  <Image
    alt="Portrait of Ali Ramazan"
    src="/me.webp"
    width={408}
    height={488}
    sizes="(max-width: 768px) 80vw, 408px"
    loading="eager"
    className="rounded-md"
  />
);

const Header2 = ({ text, isTurkish }: { text: string; isTurkish: boolean }) => (
  <h2
    className={`heading leading-tight md:pb-10 ${
      isTurkish
        ? "max-w-full whitespace-normal wrap-break-word text-[1.7rem] sm:text-4xl lg:text-lgHeading"
        : "sm:text-4xl lg:text-lgHeading"
    }`}
  >
    {isTurkish ? text : <SplitText text={text} />}
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
        className="sm:w-6 sm:h-6 lg:w-8 lg:h-8 brightness-0 dark:invert"
      />
      <h3 className="content2 text-zinc-700 dark:text-zinc-300 sm:text-xl lg:text-lgContent2">
        {data.title}
      </h3>
    </div>

    <p className="content3 text-zinc-600 dark:text-zinc-200 sm:text-lg lg:text-lgContent3">
      {data.description}
    </p>
  </div>
);

export default AboutPage;
