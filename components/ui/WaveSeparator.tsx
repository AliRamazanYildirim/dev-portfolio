"use client";

import React from "react";
import { motion } from "framer-motion";
import { easeInOut } from "framer-motion";

interface WaveSeparatorProps {
  className?: string;
  animationDuration?: number;
}

const WaveSeparator: React.FC<WaveSeparatorProps> = ({
  className = "mb-8 md:mb-12",
  animationDuration = 3,
}) => {
  // Animation variants for waves
  const waveVariants = {
    animate: {
      d: [
        "M 0 50 Q 150 10 300 30 T 600 20 T 900 35 T 1200 25 L 1200 60 L 0 60 Z",
        "M 0 50 Q 150 30 300 35 T 600 25 T 900 40 T 1200 30 L 1200 60 L 0 60 Z",
        "M 0 50 Q 150 15 300 28 T 600 18 T 900 38 T 1200 22 L 1200 60 L 0 60 Z",
        "M 0 50 Q 150 10 300 30 T 600 20 T 900 35 T 1200 25 L 1200 60 L 0 60 Z",
      ],
      transition: {
        duration: animationDuration,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  const secondaryWaveVariants = {
    animate: {
      d: [
        "M 0 40 Q 150 25 300 35 T 600 32 T 900 40 T 1200 38 L 1200 60 L 0 60 Z",
        "M 0 40 Q 150 20 300 30 T 600 28 T 900 38 T 1200 35 L 1200 60 L 0 60 Z",
        "M 0 40 Q 150 28 300 38 T 600 35 T 900 42 T 1200 40 L 1200 60 L 0 60 Z",
        "M 0 40 Q 150 25 300 35 T 600 32 T 900 40 T 1200 38 L 1200 60 L 0 60 Z",
      ],
      transition: {
        duration: animationDuration,
        repeat: Infinity,
        ease: easeInOut,
        delay: 0.2,
      },
    },
  };

  const accentLineVariants = {
    animate: {
      d: [
        "M 0 40 Q 150 25 300 35 T 600 28 T 900 38 T 1200 32",
        "M 0 40 Q 150 30 300 38 T 600 32 T 900 42 T 1200 35",
        "M 0 40 Q 150 22 300 32 T 600 25 T 900 35 T 1200 30",
        "M 0 40 Q 150 25 300 35 T 600 28 T 900 38 T 1200 32",
      ],
      transition: {
        duration: animationDuration,
        repeat: Infinity,
        ease: easeInOut,
        delay: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`${className} flex justify-center`}
    >
      <svg
        className="w-full h-12 md:h-16"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definition - Golden tones */}
        <defs>
          <linearGradient
            id="separatorGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "rgba(217, 119, 6, 0)" }} />
            <stop offset="15%" style={{ stopColor: "rgba(180, 83, 9, 0.3)" }} />
            <stop
              offset="25%"
              style={{ stopColor: "rgba(217, 119, 6, 0.5)" }}
            />
            <stop
              offset="35%"
              style={{ stopColor: "rgba(251, 146, 60, 0.6)" }}
            />
            <stop
              offset="45%"
              style={{ stopColor: "rgba(245, 158, 11, 0.7)" }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "rgba(250, 204, 21, 0.8)" }}
            />
            <stop
              offset="55%"
              style={{ stopColor: "rgba(245, 158, 11, 0.7)" }}
            />
            <stop
              offset="65%"
              style={{ stopColor: "rgba(251, 146, 60, 0.6)" }}
            />
            <stop
              offset="75%"
              style={{ stopColor: "rgba(217, 119, 6, 0.5)" }}
            />
            <stop offset="85%" style={{ stopColor: "rgba(180, 83, 9, 0.3)" }} />
            <stop offset="100%" style={{ stopColor: "rgba(217, 119, 6, 0)" }} />
          </linearGradient>
        </defs>

        {/* Large flowing wave path with animation */}
        <motion.path
          d="M 0 50 Q 150 10 300 30 T 600 20 T 900 35 T 1200 25 L 1200 60 L 0 60 Z"
          fill="url(#separatorGradient)"
          opacity="0.6"
          variants={waveVariants}
          animate="animate"
        />

        {/* Secondary wave for depth with animation */}
        <motion.path
          d="M 0 40 Q 150 25 300 35 T 600 32 T 900 40 T 1200 38 L 1200 60 L 0 60 Z"
          fill="url(#separatorGradient)"
          opacity="0.3"
          variants={secondaryWaveVariants}
          animate="animate"
        />

        {/* Accent line at top with animation */}
        <motion.path
          d="M 0 40 Q 150 25 300 35 T 600 28 T 900 38 T 1200 32"
          stroke="url(#separatorGradient)"
          strokeWidth="5"
          fill="none"
          opacity="0.3"
          strokeLinecap="round"
          variants={accentLineVariants}
          animate="animate"
        />
      </svg>
    </motion.div>
  );
};

export default WaveSeparator;
