"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  startTransition,
} from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import { useTheme } from "next-themes";

const CORD_BASE_PATH = "M10 -6 C10 4 10 11 10 15 C10 20 10 25 10 30";
const CORD_WAVE_RIGHT_PATH = "M10 -6 C15 4 4 11 10 15 C14 20 6 25 10 30";
const CORD_WAVE_LEFT_PATH = "M10 -6 C5 4 16 11 10 15 C6 20 14 25 10 30";
const UPPER_CORD_BASE_PATH = "M8 0 C7.2 7 8.8 13 8 24";
const UPPER_CORD_WAVE_RIGHT_PATH = "M8 0 C10.8 7 5.2 13 8 24";
const UPPER_CORD_WAVE_LEFT_PATH = "M8 0 C5.2 7 10.8 13 8 24";

const cordSwingVariants: Variants = {
  idle: { y: 0 },
  pull: {
    y: [0, 7, -2, 1, 0],
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
      times: [0, 0.35, 0.62, 0.82, 1],
    },
  },
};

const upperCordPathVariants: Variants = {
  idle: { d: UPPER_CORD_BASE_PATH },
  pull: {
    d: [
      UPPER_CORD_BASE_PATH,
      UPPER_CORD_WAVE_RIGHT_PATH,
      UPPER_CORD_WAVE_LEFT_PATH,
      UPPER_CORD_BASE_PATH,
    ],
    transition: {
      duration: 0.58,
      ease: [0.45, 0.05, 0.55, 0.95],
      times: [0, 0.32, 0.62, 1],
    },
  },
};

const cordPathVariants: Variants = {
  idle: { d: CORD_BASE_PATH },
  pull: {
    d: [
      CORD_BASE_PATH,
      CORD_WAVE_RIGHT_PATH,
      CORD_WAVE_LEFT_PATH,
      CORD_WAVE_RIGHT_PATH,
      CORD_BASE_PATH,
    ],
    transition: {
      duration: 0.58,
      ease: [0.45, 0.05, 0.55, 0.95],
      times: [0, 0.3, 0.56, 0.8, 1],
    },
  },
};

/**
 * HangingLampToggle — Dark/Light mode switcher.
 * Hangs from the right edge of the viewport at vertical center.
 * Click or press Enter/Space to toggle theme.
 */
export default function HangingLampToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const lampControls = useAnimation();
  const cordControls = useAnimation();

  // Must use useState+useEffect so server and client both start with mounted=false
  // This prevents hydration mismatch (resolvedTheme is populated before hydration on client)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleToggle = useCallback(async () => {
    // Pull cord bends into a springy S-wave and settles back
    cordControls.start("pull");

    // Lamp swing: natural pendulum feel
    lampControls.start({
      rotate: [0, isDark ? -12 : 12, isDark ? 8 : -8, isDark ? -4 : 4, 0],
      transition: {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      },
    });

    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme, lampControls, cordControls]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  // Prevent hydration mismatch: render placeholder until mounted
  if (!mounted) {
    return (
      <div className="pointer-events-none fixed right-6 max-lg:right-8.5 max-lg:top-17 max-lg:landscape:top-26 lg:top-0 z-50 flex flex-col items-center" />
    );
  }

  return (
    <div className="fixed right-6 max-lg:right-8.5 max-lg:top-17 max-lg:landscape:top-26 lg:top-0 z-50">
      {/* Ceiling bracket */}
      <div className="mx-auto flex flex-col items-center">
        {/* Bracket plate */}
        <div
          className={`h-2 w-7 rounded-sm ${
            isDark
              ? "bg-zinc-500 shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
              : "bg-[#8a7045] shadow-[0_1px_6px_rgba(138,112,69,0.35)]"
          }`}
        />
        {/* Bracket peg */}
        <div
          className={`h-1.5 w-1 rounded-b-sm ${isDark ? "bg-zinc-600" : "bg-[#8a7045]"}`}
        />
      </div>

      {/* Swing wrapper — origin at top so it rotates from ceiling */}
      <motion.div
        animate={lampControls}
        style={{ originX: "50%", originY: "0%" }}
        className="flex flex-col items-center"
      >
        {/* Upper wire (ceiling → lamp) */}
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
          aria-hidden="true"
        >
          <motion.path
            initial="idle"
            variants={upperCordPathVariants}
            animate={cordControls}
            d={UPPER_CORD_BASE_PATH}
            fill="none"
            stroke={isDark ? "#71717a" : "#a08450"}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        {/* Lamp shade + glow */}
        <button
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          tabIndex={0}
          className="group relative flex flex-col items-center focus:outline-none"
        >
          {/* Glow halo — dark mode only */}
          {isDark && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                top: "30%",
                background:
                  "radial-gradient(ellipse 60px 50px at 50% 60%, rgba(251,191,36,0.28) 0%, rgba(251,191,36,0.08) 60%, transparent 100%)",
                filter: "blur(8px)",
                zIndex: -1,
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Lamp shade SVG */}
          <svg
            width="36"
            height="28"
            viewBox="0 0 36 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md transition-all duration-300 group-hover:brightness-110"
          >
            {/* Shade body */}
            <path
              d="M13 4 L23 4 L35 24 L1 24 Z"
              fill={
                isDark ? "url(#shadeGradientDark)" : "url(#shadeGradientLight)"
              }
              stroke={isDark ? "#78716c" : "#7a5e28"}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Top cap */}
            <rect
              x="13"
              y="1"
              width="10"
              height="4"
              rx="1.5"
              fill={isDark ? "#57534e" : "#b8922e"}
              stroke={isDark ? "#78716c" : "#7a5e28"}
              strokeWidth="0.5"
            />
            {/* Inner glow when dark */}
            {isDark && (
              <ellipse
                cx="18"
                cy="19"
                rx="7"
                ry="4"
                fill="rgba(251,191,36,0.18)"
              />
            )}
            {/* Bottom rim highlight */}
            <line
              x1="1"
              y1="24"
              x2="35"
              y2="24"
              stroke={isDark ? "#a8955a" : "#7a5e28"}
              strokeWidth="1"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="shadeGradientDark"
                x1="18"
                y1="4"
                x2="18"
                y2="24"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#44403c" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
              <linearGradient
                id="shadeGradientLight"
                x1="18"
                y1="4"
                x2="18"
                y2="24"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#d4a84b" />
                <stop offset="100%" stopColor="#a87830" />
              </linearGradient>
            </defs>
          </svg>

          {/* Bulb hint visible through shade bottom in dark mode */}
          {isDark && (
            <motion.div
              className="pointer-events-none absolute"
              style={{ bottom: 2, width: 8, height: 8 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-full w-full rounded-full bg-amber-300/70 blur-[3px]" />
            </motion.div>
          )}
        </button>

        {/* Pull cord */}
        <motion.div
          initial="idle"
          variants={cordSwingVariants}
          animate={cordControls}
          style={{ originY: "0%" }}
          className="-mt-1 flex flex-col items-center"
        >
          {/* Cord line */}
          <svg
            width="20"
            height="30"
            viewBox="0 0 20 30"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
            aria-hidden="true"
          >
            <motion.path
              initial="idle"
              variants={cordPathVariants}
              animate={cordControls}
              d={CORD_BASE_PATH}
              fill="none"
              stroke={isDark ? "#71717a" : "#a08450"}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>

          {/* Pull knob */}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92, y: 2 }}
            className={`-mt-px h-3 w-3 cursor-pointer rounded-full border transition-colors duration-300 ${
              isDark
                ? "border-zinc-500 bg-zinc-700 shadow-[0_0_6px_rgba(251,191,36,0.3)]"
                : "border-[#7a5e28] bg-[#c58d12] shadow-[0_1px_6px_rgba(197,141,18,0.4)]"
            }`}
            onClick={handleToggle}
            aria-hidden="true"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
