"use client";

import React from "react";
import { motion } from "framer-motion";
import RatingStars from "./RatingStars";
import type { GoogleRating } from "@/constants/googleRatings";

interface RatingCardProps {
  rating: GoogleRating;
  index: number;
  verifiedLabel: string;
}

const RatingCard: React.FC<RatingCardProps> = ({
  rating,
  index,
  verifiedLabel,
}) => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.15 },
    },
    hover: { y: -8, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="group h-full"
    >
      <div className="relative h-full rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-linear-to-br dark:from-zinc-900 dark:to-black p-6 md:p-8 transition-all duration-300 hover:border-[#c58d12]/40 overflow-hidden">
        {/* Gold hover glow */}
        <div className="absolute inset-0 bg-linear-to-br from-[#c58d12]/0 via-[#c58d12]/0 to-[#c58d12]/0 transition-all duration-500 group-hover:from-[#c58d12]/5 group-hover:to-[#c58d12]/8 pointer-events-none" />
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-[#c58d12] to-transparent transition-all duration-500 group-hover:w-full" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3 flex-1">
              <h3 className="font-satoshi font-semibold text-lg text-zinc-900 dark:text-white leading-tight group-hover:text-[#c58d12] transition-colors duration-300">
                {rating.businessName}
              </h3>
              <div className="flex items-center gap-3">
                <RatingStars rating={rating.rating} size="md" animated={true} />
                <span className="font-satoshi font-bold text-zinc-900 dark:text-white text-lg">
                  {rating.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {rating.badges.includes("verified") && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.3 }}
                className="shrink-0"
              >
                <div className="rounded-full bg-emerald-500 dark:bg-emerald-600 shadow-[0_0_12px_rgba(52,211,153,0.45)] p-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </motion.div>
            )}
          </div>

          {/* Review Text */}
          <p className="font-satoshi text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed grow">
            &ldquo;{rating.reviewText}&rdquo;
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-500 dark:text-zinc-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-zinc-400 dark:text-zinc-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                />
              </svg>
              <span>{rating.verificationDate}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-emerald-600 font-medium">
                {verifiedLabel}
              </span>
            </div>
          </div>

          {/* Positive percentage indicator */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500 dark:text-zinc-500">
                Positive
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {rating.positivePercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rating.positivePercentage}%` }}
                transition={{ delay: index * 0.15 + 0.2, duration: 0.8 }}
                className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RatingCard;
