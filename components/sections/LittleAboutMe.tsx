"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Marquee from "@/components/ui/Marquee";
import SplitText from "@/TextAnimations/SplitText";
import { useTranslation } from "@/hooks/useTranslation";

const LittleAboutMe = () => {
  const { dictionary } = useTranslation();
  const littleAbout = dictionary.littleAbout;

  return (
    <section id="about-section" className="px-7 pt-12 md:pt-10 text-white">
      <div className="container pb-12 mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2 lg:pb-36 lg:gap-0 items-start landscape:max-lg:grid-cols-1 landscape:max-lg:gap-4">
        <div>
          <Header text={littleAbout.heading} />
          <Paragraph text={littleAbout.paragraphOne} />
        </div>
        <div className="flex flex-col h-full lg:pt-48">
          <Paragraph2 text={littleAbout.paragraphTwo} />
          <MoreAboutMe cta={littleAbout.cta} />
        </div>
      </div>
      <Marquee />
    </section>
  );
};

const Header = ({ text }: { text: string }) => (
  <h2 className="heading mb-5 lg:text-lgHeading lg:mb-16">
    <SplitText text={text} />
  </h2>
);

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Paragraph = ({ text }: { text: string }) => (
  <motion.p
    className="content lg:pl-10 lg:text-lgContent lg:order-1"
    variants={fadeInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    {text}
  </motion.p>
);

const Paragraph2 = ({ text }: { text: string }) => (
  <motion.p
    className="content lg:text-lgContent lg:order-1 max-w-2xl lg:ml-auto"
    variants={fadeInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 2, ease: "easeOut" }}
  >
    {text}
  </motion.p>
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

const MoreAboutMe = ({ cta }: { cta: string }) => (
  <motion.div
    className="flex pt-5 items-center text-gray group lg:order-0 max-w-lg lg:pl-24 lg:pb-10"
    variants={fadeInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 2, ease: "easeOut" }}
  >
    <Link href="/about" passHref>
      <span className="button text-white font-bold mr-2 lg:text-lgButton hover:underline transition">
        {cta}
      </span>
    </Link>
    <Link href="/about" passHref>
      <Icon
        src="/icons/arrowup.svg"
        alt="Arrow Up Icon"
        width={16}
        height={16}
        additionalClasses="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
      />
    </Link>
  </motion.div>
);

export default LittleAboutMe;
