"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Provides the global Solutions-style dark background:
 * pure-black base → subtle zinc grid overlay → two animated gold glow blobs.
 * Rendered as `position:fixed` so it sits behind all page content.
 */
export default function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20" />

      {/* Gold glow — top-left */}
      <motion.div
        className="absolute top-1/4 left-1/4 h-160 w-160 rounded-full bg-[#c58d12]/10 blur-[140px]"
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gold glow — bottom-right */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-160 w-160 rounded-full bg-[#c58d12]/10 blur-[140px]"
        animate={{ scale: [1.25, 1, 1.25], opacity: [0.45, 0.25, 0.45] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
