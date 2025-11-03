"use client";

import React from "react";
import { motion } from "framer-motion";

interface PremiumSeparatorProps {
  className?: string;
  delay?: number;
}

const PremiumSeparator: React.FC<PremiumSeparatorProps> = ({
  className = "mt-8 md:mt-12 mb-8 md:mb-12",
  delay = 0,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
    >
      <div className="relative flex items-center justify-center gap-4">
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent rounded-full blur-2xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Left accent line with animation */}
        <motion.div
          className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.8 }}
          style={{ originX: 0 }}
        />

        {/* Center premium dot with glow */}
        <motion.div
          className="relative w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 shadow-lg shadow-amber-500/70"
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 360 }}
          transition={{ delay: delay + 0.4, duration: 1 }}
          whileHover={{ scale: 1.3 }}
        >
          {/* Inner bright spot */}
          <motion.div
            className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white to-transparent opacity-80"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400/0 via-amber-500/40 to-orange-600/0"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Right accent line with animation */}
        <motion.div
          className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.8 }}
          style={{ originX: 1 }}
        />
      </div>
    </motion.div>
  );
};

export default PremiumSeparator;
