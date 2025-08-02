"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Marquee from "@/components/ui/Marquee";
import SplitText from "@/TextAnimations/SplitText";

const LittleAboutMe = () => {
  return (
    <section id="about-section" className="px-7 pt-12 md:pt-40 text-white">
      <div className="container pb-12 mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:pb-36 md:gap-0 items-start ">
        <div>
          <Header />
          <Paragraph />
        </div>
        <div className="flex flex-col h-full md:pt-48">
          <Paragraph2 />
          <MoreAboutMe />
        </div>
      </div>
      <Marquee />
    </section>
  );
};

const Header = () => (
  <SplitText text="A Little About Me -" className="heading mb-5 md:text-lgHeading md:mb-16 " />
);

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Paragraph = () => (
  <motion.p
    className="content md:pl-10 md:text-lgContent md:order-1"
    variants={fadeInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    I am a Full-Stack Software Developer with extensive experience in modern web technologies such as JavaScript, Node.js, Next.js, React, Blazor, and .NET Core. Through my work on e-commerce platforms, microservices, and blog applications, I have developed a strong focus on scalable software architectures and best practices. My background includes hands-on development, problem-solving, and optimizing performance in web applications.
  </motion.p>
);

const Paragraph2 = () => (
  <motion.p
    className="content md:text-lgContent md:order-1 max-w-2xl lg:ml-auto"
    variants={fadeInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 2, ease: "easeOut" }}
  >
    JavaScript, C#, TypeScript, React, and Next.js—building real-world solutions through technology.
    Thriving in collaborative environments, I am always looking for new ways to refine my skills and
    create impactful solutions.
  </motion.p>
);

interface IconProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  additionalClasses?: string;
}

const Icon: React.FC<IconProps> = ({ src, alt, width, height, additionalClasses = "" }) => (
  <Image src={src} alt={alt} width={width} height={height} className={additionalClasses} />
);

const MoreAboutMe = () => (
  <motion.div
    className="flex pt-5 items-center text-gray group md:order-0 max-w-lg md:pl-24 md:pb-10"
    variants={fadeInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 2, ease: "easeOut" }}
  >
    <Link href="/about" passHref>
      <span className="button text-white font-bold mr-2 md:text-lgButton hover:underline transition">
        (Know More About Me)
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
