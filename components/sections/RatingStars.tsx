"use client";

import React from "react";
import { motion } from "framer-motion";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = "md",
  animated = true,
}) => {
  const sizeMap = {
    sm: {
      width: 14,
      height: 14,
      gap: 2,
    },
    md: {
      width: 18,
      height: 18,
      gap: 3,
    },
    lg: {
      width: 24,
      height: 24,
      gap: 4,
    },
  };

  const { width, height, gap } = sizeMap[size];

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      const isFullStar = i < fullStars;
      const isHalfStar = i === fullStars && hasHalfStar;

      const starVariants = {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 },
      };

      const starContent = (
        <motion.div
          key={i}
          variants={animated ? starVariants : {}}
          initial={animated ? "initial" : false}
          animate={animated ? "animate" : false}
          transition={animated ? { delay: i * 0.1 } : {}}
          className="drop-shadow-md"
        >
          <svg
            width={width}
            height={height}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Unique defs per star to avoid id collisions */}
            <defs>
              <linearGradient
                id={`starGrad-${i}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>

              <radialGradient
                id={`starHighlight-${i}`}
                cx="30%"
                cy="20%"
                r="60%"
              >
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>

              <filter
                id={`starShadow-${i}`}
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

              {/* half-fill gradient (left half filled) */}
              <linearGradient
                id={`half-star-${i}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="50%" stopColor="#FACC15" stopOpacity="0" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>
            </defs>

            {isHalfStar ? (
              <g filter={`url(#starShadow-${i})`}>
                <path
                  d="M32 4 L39 24 L60 24 L42 36 L49 56 L32 44 L15 56 L22 36 L4 24 L25 24 Z"
                  fill={`url(#half-star-${i})`}
                  stroke="#EAB308"
                  strokeWidth="0.8"
                />
                <path
                  d="M32 8 L37 24 L52 24 L39 32 L44 48 L32 38 L20 48 L25 32 L12 24 L27 24 Z"
                  fill={`url(#starHighlight-${i})`}
                  opacity="0.6"
                />
              </g>
            ) : (
              <g filter={`url(#starShadow-${i})`}>
                <path
                  d="M32 4 L39 24 L60 24 L42 36 L49 56 L32 44 L15 56 L22 36 L4 24 L25 24 Z"
                  fill={isFullStar ? `url(#starGrad-${i})` : "currentColor"}
                  stroke={isFullStar ? "#EAB308" : "none"}
                  strokeWidth={isFullStar ? "0.8" : "0"}
                  className={isFullStar ? undefined : "text-white/20"}
                />
                {isFullStar && (
                  <path
                    d="M32 8 L37 24 L52 24 L39 32 L44 48 L32 38 L20 48 L25 32 L12 24 L27 24 Z"
                    fill={`url(#starHighlight-${i})`}
                    opacity="0.6"
                  />
                )}
              </g>
            )}
          </svg>
        </motion.div>
      );

      stars.push(starContent);
    }

    return stars;
  };

  return (
    <div className="flex items-center" style={{ gap: `${gap}px` }}>
      {renderStars()}
    </div>
  );
};

export default RatingStars;
