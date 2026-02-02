"use client";

import React from "react";
import { motion } from "framer-motion";
import SplitText from "@/TextAnimations/SplitText";
import ReviewsCarousel from "./ReviewsCarousel";
import WaveSeparator from "@/components/ui/WaveSeparator";
import NoiseBackground from "@/components/NoiseBackground";
import { useTranslation } from "@/hooks/useTranslation";
import {
  enGoogleRatings,
  deGoogleRatings,
  trGoogleRatings,
} from "@/constants/googleRatings";
import PremiumSeparator from "../ui/PremiumSeparator";

const GoogleRatings: React.FC = () => {
  const { language, t } = useTranslation();

  const ratingsContent =
    {
      en: enGoogleRatings,
      de: deGoogleRatings,
      tr: trGoogleRatings,
    }[language] || enGoogleRatings;

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Calculate average rating
  const averageRating = (
    ratingsContent.ratings.reduce((sum, r) => sum + r.rating, 0) /
    ratingsContent.ratings.length
  ).toFixed(1);

  // Calculate total reviews
  // Number of testimonial entries (we removed per-rating totalReviews)
  const totalTestimonials = ratingsContent.ratings.length;

  // Calculate average positive percentage
  const avgPositive = Math.round(
    ratingsContent.ratings.reduce((sum, r) => sum + r.positivePercentage, 0) /
      ratingsContent.ratings.length
  );

  return (
    <section className="container mx-auto md:px-28 mt-16 px-7">
      {/* Decorative Separator */}
      <PremiumSeparator className="mb-8 md:mb-12" />

      {/* Header Section */}
      <motion.div
        className="text-center mb-12 md:mb-16 mt-16 md:mt-20"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Strapline */}
        <motion.span
          variants={itemVariants}
          className="uppercase tracking-[0.5em] font-semibold text-sm md:text-base lg:text-lg text-white/90 "
        >
          ⭐ GOOGLE RATINGS ⭐
        </motion.span>

        {/* Main Heading */}
        <motion.div
          variants={itemVariants}
          className="w-full flex justify-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-lgHeading font-extrabold mt-16 md:mt-20 text-white w-fit">
            <SplitText text={ratingsContent.heading} />
          </h2>
        </motion.div>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="font-satoshi text-content2 text-white/70 mt-6 md:mt-8 max-w-2xl mx-auto"
        >
          {ratingsContent.subheading}
        </motion.p>

        {/* Stats Bar */}
        <motion.div variants={itemVariants}>
          <NoiseBackground
            mode="light"
            intensity={0.08}
            className="flex flex-row items-center justify-between sm:justify-center gap-2 sm:gap-4 md:gap-12 mt-8 md:mt-10 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg relative overflow-hidden"
          >
            {/* Average Rating */}
            <div className="flex flex-1 min-w-0 items-center justify-center gap-2 sm:gap-3 relative z-10">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Star"
                >
                  <defs>
                    <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFF59D" />
                      <stop offset="50%" stopColor="#FACC15" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                    <radialGradient
                      id="starHighlight"
                      cx="30%"
                      cy="20%"
                      r="60%"
                    >
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </radialGradient>
                    <filter
                      id="starShadow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="3"
                        stdDeviation="3"
                        floodColor="#000"
                        floodOpacity="0.25"
                      />
                    </filter>
                  </defs>

                  <g filter="url(#starShadow)">
                    <path
                      d="M32 4 L39 24 L60 24 L42 36 L49 56 L32 44 L15 56 L22 36 L4 24 L25 24 Z"
                      fill="url(#starGrad)"
                      stroke="#EAB308"
                      strokeWidth="1"
                    />
                    <path
                      d="M32 8 L37 24 L52 24 L39 32 L44 48 L32 38 L20 48 L25 32 L12 24 L27 24 Z"
                      fill="url(#starHighlight)"
                      opacity="0.6"
                    />
                  </g>
                </svg>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                  {averageRating}
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm text-black/60 mt-1">
                  {t("googleRatings.averageRating")}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-black/20" />

            {/* Total Testimonials */}
            <div className="flex-1 min-w-0 text-center relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                {totalTestimonials.toLocaleString()}
              </div>
              <div className="text-[11px] sm:text-xs md:text-sm text-black/60 mt-1">
                {t("googleRatings.testimonials")}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-black/20" />

            {/* Positive Percentage */}
            <div className="flex-1 min-w-0 text-center relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
                {avgPositive}%
              </div>
              <div className="text-[11px] sm:text-xs md:text-sm text-black/60 mt-1">
                {t("googleRatings.positiveReviews")}
              </div>
            </div>
          </NoiseBackground>
        </motion.div>
      </motion.div>

      {/* Rating Cards Carousel */}
      <motion.div
        variants={itemVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-16 md:mt-20"
      >
        <ReviewsCarousel
          reviews={ratingsContent.ratings}
          reviewsLabel={ratingsContent.reviews}
          verifiedLabel={ratingsContent.verified}
        />
      </motion.div>

      {/* Call to Action */}
      <motion.div
        variants={itemVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        className="flex justify-center mt-12 md:mt-16 pb-12 md:pb-16"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex rounded-xl overflow-hidden bg-linear-to-r from-yellow-500 via-amber-500 to-orange-600 shadow-lg hover:shadow-xl hover:shadow-amber-500/50 transition-all duration-300"
        >
          <a
            href={ratingsContent.ratings[0]?.googleProfileUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 font-satoshi font-semibold text-black hover:text-black/90 transition-all duration-300 relative z-10"
          >
            <span>{t("googleRatings.seeMore")}</span>
            <motion.svg
              className="w-5 h-5 md:w-6 md:h-6 text-black drop-shadow-md group-hover:drop-shadow-lg transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GoogleRatings;
