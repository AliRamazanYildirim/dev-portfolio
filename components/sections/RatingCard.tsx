"use client";

import React from "react";
import { motion } from "framer-motion";
import RatingStars from "./RatingStars";
import NoiseBackground from "@/components/ui/NoiseBackground";
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
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="group"
    >
      <NoiseBackground
        mode="light"
        intensity={0.08}
        className="relative h-full rounded-2xl p-6 md:p-8 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden group-hover:shadow-xl"
      >
        {/* Background gradient effect on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full gap-4">
          {/* Header with rating and badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3 flex-1">
              {/* Business Name */}
              <h3 className="font-satoshi font-semibold text-lg text-black leading-tight">
                {rating.businessName}
              </h3>

              {/* Rating Stars and Number */}
              <div className="flex items-center gap-3">
                <RatingStars rating={rating.rating} size="md" animated={true} />
                <span className="font-satoshi font-bold text-black text-lg">
                  {rating.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Verified Badge */}
            {rating.badges.includes("verified") && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.3 }}
                className="shrink-0"
              >
                <div className="bg-linear-to-br from-emerald-200 to-emerald-400 border border-emerald-600/40 rounded-full p-2 backdrop-blur-sm">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-emerald-700"
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
          <p className="font-satoshi text-sm md:text-base text-black/80 leading-relaxed grow">
            &ldquo;{rating.reviewText}&rdquo;
          </p>

          {/* Footer - Verification date and verified label */}
          <div className="flex items-center justify-between pt-4 border-t border-black/10">
            <div className="flex items-center gap-2 text-xs md:text-sm text-black/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-black/50"
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
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span className="text-green-600 font-medium">
                {verifiedLabel}
              </span>
            </div>
          </div>

          {/* Positive percentage indicator */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-black/60">Positive</span>
              <span className="text-xs font-medium text-black/80">
                {rating.positivePercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rating.positivePercentage}%` }}
                transition={{ delay: index * 0.15 + 0.2, duration: 0.8 }}
                className="h-full bg-linear-to-r from-green-500 to-emerald-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </NoiseBackground>
    </motion.div>
  );
};

export default RatingCard;
