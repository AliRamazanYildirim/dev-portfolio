"use client";

import React from "react";
import SplitText from "@/components/animations/SplitText";
import ReviewsCarousel from "./ReviewsCarousel";
import { useTranslation } from "@/hooks/useTranslation";
import {
  enGoogleRatings,
  deGoogleRatings,
  trGoogleRatings,
  frGoogleRatings,
} from "@/constants/googleRatings";
import PremiumSeparator from "../ui/PremiumSeparator";

const GoogleRatings: React.FC = () => {
  const { language, t } = useTranslation();

  const ratingsContent =
    {
      en: enGoogleRatings,
      de: deGoogleRatings,
      tr: trGoogleRatings,
      fr: frGoogleRatings,
    }[language] || enGoogleRatings;

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
      ratingsContent.ratings.length,
  );

  return (
    <section className="container mx-auto md:px-28 mt-16 px-7">
      {/* Decorative Separator */}
      <PremiumSeparator className="mb-8 md:mb-12" />

      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16 mt-16 md:mt-20 hero-reveal">
        {/* Strapline */}
        <span className="uppercase tracking-[0.5em] font-semibold text-sm md:text-base lg:text-lg text-zinc-700 dark:text-white/90 ">
          ⭐ GOOGLE RATINGS ⭐
        </span>

        {/* Main Heading */}
        <div className="w-full flex justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-lgHeading font-extrabold mt-16 md:mt-20 text-zinc-900 dark:text-white w-fit">
            <SplitText text={ratingsContent.heading} />
          </h2>
        </div>

        {/* Subheading */}
        <p className="font-satoshi text-content2 text-zinc-600 dark:text-white/70 mt-6 md:mt-8 max-w-2xl mx-auto">
          {ratingsContent.subheading}
        </p>

        {/* Stats Bar */}
        <div className="mt-8 md:mt-10">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]">
            {/* Top shimmer line */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#c58d12]/50 to-transparent" />

            {/* Soft background glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-28 bg-[#c58d12]/4 dark:bg-[#c58d12]/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-3">
              {/* Stat 1: Average Rating */}
              <div className="flex flex-col items-center gap-3 py-6 px-3 sm:py-8 sm:px-6 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 ring-1 ring-amber-200/70 dark:ring-amber-800/40 flex items-center justify-center transition-all duration-300 group-hover:ring-amber-300 dark:group-hover:ring-amber-700/60 group-hover:scale-105">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Star"
                  >
                    <defs>
                      <linearGradient
                        id="starGrad2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#FFF59D" />
                        <stop offset="50%" stopColor="#FACC15" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                      <filter
                        id="starShadow2"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="2"
                          stdDeviation="2"
                          floodColor="#000"
                          floodOpacity="0.2"
                        />
                      </filter>
                    </defs>
                    <g filter="url(#starShadow2)">
                      <path
                        d="M32 4 L39 24 L60 24 L42 36 L49 56 L32 44 L15 56 L22 36 L4 24 L25 24 Z"
                        fill="url(#starGrad2)"
                        stroke="#EAB308"
                        strokeWidth="1"
                      />
                    </g>
                  </svg>
                </div>
                <div className="text-center space-y-1.5">
                  <div className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight tabular-nums leading-none">
                    {averageRating}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-200 font-medium uppercase tracking-wider">
                    {t("googleRatings.averageRating")}
                  </div>
                </div>
              </div>

              {/* Divider 1 */}
              <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-px h-30 bg-zinc-300 dark:bg-zinc-700" />

              {/* Stat 2: Total Testimonials */}
              <div className="flex flex-col items-center gap-3 py-6 px-3 sm:py-8 sm:px-6 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 ring-1 ring-sky-200/70 dark:ring-sky-800/40 flex items-center justify-center transition-all duration-300 group-hover:ring-sky-300 dark:group-hover:ring-sky-700/60 group-hover:scale-105">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 dark:text-sky-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                </div>
                <div className="text-center space-y-1.5">
                  <div className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight tabular-nums leading-none">
                    {totalTestimonials.toLocaleString()}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-200 font-medium uppercase tracking-wider">
                    {t("googleRatings.testimonials")}
                  </div>
                </div>
              </div>

              {/* Divider 2 */}
              <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-px h-30 bg-zinc-300 dark:bg-zinc-700" />

              {/* Stat 3: Positive Percentage */}
              <div className="flex flex-col items-center gap-3 py-6 px-3 sm:py-8 sm:px-6 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 ring-1 ring-emerald-200/70 dark:ring-emerald-800/40 flex items-center justify-center transition-all duration-300 group-hover:ring-emerald-300 dark:group-hover:ring-emerald-700/60 group-hover:scale-105">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 dark:text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                  </svg>
                </div>
                <div className="text-center space-y-1.5">
                  <div className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight tabular-nums leading-none">
                    {avgPositive}%
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-200 font-medium uppercase tracking-wider">
                    {t("googleRatings.positiveReviews")}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom shimmer line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-zinc-200/80 dark:via-zinc-700/50 to-transparent" />
          </div>
        </div>
      </div>

      {/* Rating Cards Carousel */}
      <div className="mt-16 md:mt-20 hero-reveal">
        <ReviewsCarousel
          reviews={ratingsContent.ratings}
          reviewsLabel={ratingsContent.reviews}
          verifiedLabel={ratingsContent.verified}
        />
      </div>

      {/* Call to Action */}
      <div className="flex justify-center mt-12 md:mt-16 pb-12 md:pb-16 hero-reveal">
        <div className="inline-flex rounded-xl overflow-hidden bg-linear-to-r from-yellow-500 via-amber-500 to-orange-600 shadow-lg hover:shadow-xl hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300">
          <a
            href={ratingsContent.ratings[0]?.googleProfileUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 font-satoshi font-semibold text-black hover:text-black/90 transition-all duration-300 relative z-10"
          >
            <span>{t("googleRatings.seeMore")}</span>
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-black drop-shadow-md group-hover:drop-shadow-lg group-hover:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleRatings;
