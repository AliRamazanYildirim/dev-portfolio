"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SplitText from "@/TextAnimations/SplitText";
import { footerItems } from "@/data";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationDictionary } from "@/constants/translations";

export default function Hero() {
  const { dictionary } = useTranslation();
  const heroDictionary = dictionary.hero;
  const footerDictionary = dictionary.footer;

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="px-7 pb-10 md:pb-40 min-h-screen flex flex-col"
    >
      <div className="container mx-auto flex-1 flex flex-col justify-center">
        <IntroHeader
          topLine={heroDictionary.headlineTop}
          bottomLine={heroDictionary.headlineBottom}
        />
        <div className="flex-1 md:pl-10">
          <div className="flex flex-col md:flex-row-reverse md:items-start lg:items-center gap-8 md:gap-12 lg:gap-16 xl:gap-24">
            <div className="flex-shrink-0 order-first md:order-none">
              <Portrait />
            </div>
            <div className="flex-1 min-w-0">
              <IntroParagraph />
              <AboutSectionText
                about={heroDictionary.about}
                socialAriaPrefix={footerDictionary.socialAriaPrefix}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-8">
            <Location locationLabel={heroDictionary.location} />
            <ScrollForMore
              onClick={handleScrollToAbout}
              label={heroDictionary.scrollLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const IntroHeader = ({
  topLine,
  bottomLine,
}: {
  topLine: string;
  bottomLine: string;
}) => (
  <h1 className="title md:text-lgTitle mb-8 md:mb-12">
    <SplitText text={topLine} />
    <SplitText text={bottomLine} className="justify-end" />
  </h1>
);

const IntroParagraph = () => (
  <motion.div
    className="content text-gray md:text-lgContent w-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  ></motion.div>
);

const Portrait = () => (
  <Image
    alt="Portrait of Ali Ramazan"
    src="/me.jpeg"
    width={408}
    height={488}
    className="rounded-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-cover"
    priority
  />
);

const Socials = ({ ariaPrefix }: { ariaPrefix: string }) => (
  <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-center md:justify-start items-center pt-4 md:pt-6">
    {footerItems.map((item) => (
      <Link
        key={item.path}
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ariaPrefix} ${item.title}`}
        className="group flex items-center gap-2 md:gap-3 text-gray hover:text-black transition-all duration-300 ease-in-out transform hover:scale-110"
      >
        <div className="relative">
          <Image
            src={item.icon}
            alt={`${item.title} Icon`}
            width={32}
            height={32}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 transition-all duration-300"
            priority={item.title === "LinkedIn"}
          />
        </div>
        <span className="hidden md:inline-block text-sm text-[#260a03] md:text-base lg:text-lg font-medium opacity-0 md:opacity-100 transition-opacity duration-300 group-hover:opacity-100">
          {item.title}
        </span>
      </Link>
    ))}
  </div>
);

interface IconProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  additionalClasses?: string;
}

const Icon: React.FC<IconProps> = ({
  src,
  alt,
  width,
  height,
  additionalClasses = "",
}) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={additionalClasses}
  />
);

const Location = ({ locationLabel }: { locationLabel: string }) => (
  <div className="button md:text-lgButton flex items-center gap-2">
    <div className="text-[#260a03]">
      <Icon
        src="/icons/globe.svg"
        alt="Globe icon"
        width={16}
        height={16}
        additionalClasses="md:w-4 md:h-4 lg:w-6 lg:h-6 brightness-0"
      />
    </div>
    <span className="text-[#260a03]">{locationLabel}</span>
  </div>
);

const ScrollForMore = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <div className="button md:text-lgButton text-gray hidden md:flex md:items-center">
    <button onClick={onClick} className="flex items-center gap-2">
      <span className="text-[#260a03]">{label}</span>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-[#260a03]"
      >
        <Image
          src="/icons/arrowdown.svg"
          alt="Arrow Down Icon for scrolling"
          width={16}
          height={16}
          className="md:w-4 md:h-4 lg:w-6 lg:h-6 brightness-0"
        />
      </motion.div>
    </button>
  </div>
);

const AboutSectionText = ({
  about,
  socialAriaPrefix,
}: {
  about: TranslationDictionary["hero"]["about"];
  socialAriaPrefix: string;
}) => {
  const [firstParagraph, secondParagraph, finalParagraph] =
    about.introParagraphs;

  return (
    <div className="mt-8 md:mt-12 text-base md:text-lg lg:text-xl text-[#260a03] leading-relaxed space-y-4">
      {firstParagraph && <p>{firstParagraph}</p>}
      {secondParagraph && <p>{secondParagraph}</p>}
      {about.sections.map((section) => (
        <div key={section.title}>
          <strong>{section.title}</strong>
          <ul className="list-disc pl-5">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
      {finalParagraph && <p>{finalParagraph}</p>}
      <div className="pt-8">
        <Socials ariaPrefix={socialAriaPrefix} />
      </div>
    </div>
  );
};
