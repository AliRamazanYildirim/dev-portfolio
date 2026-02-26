"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageBackgroundProps {
  isDark?: boolean;
}

/**
 * Provides the global animated glow background.
 * Dark mode: deep gold blobs on black.
 * Light mode: soft warm-amber blobs on beige.
 * Rendered as `position:fixed` so it sits behind all page content.
 */
export default function PageBackground({ isDark = true }: PageBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Glow — top-left */}
      <motion.div
        className={`absolute top-1/4 left-1/4 h-160 w-160 rounded-full blur-[130px] ${
          isDark ? "bg-[#c58d12]/15" : "bg-[#c58d12]/20"
        }`}
        animate={{
          scale: [1, 1.25, 1],
          opacity: isDark ? [0.35, 0.55, 0.35] : [0.38, 0.58, 0.38],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glow — bottom-right */}
      <motion.div
        className={`absolute bottom-1/4 right-1/4 h-160 w-160 rounded-full blur-[130px] ${
          isDark ? "bg-[#c58d12]/15" : "bg-amber-400/20"
        }`}
        animate={{
          scale: [1.25, 1, 1.25],
          opacity: isDark ? [0.55, 0.35, 0.55] : [0.52, 0.32, 0.52],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Extra glow — center, light mode only */}
      {!isDark && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-120 w-120 rounded-full bg-orange-300/20 blur-[150px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.28, 0.45, 0.28] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      )}
    </div>
  );
}
