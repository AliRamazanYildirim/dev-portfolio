"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  startTransition,
} from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { language } = useTranslation();
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

  const darkLabels: Record<string, string> = {
    de: "DUNKEL",
    tr: "KOYU",
    fr: "SOMBRE",
    en: "DARK",
  };
  const lightLabels: Record<string, string> = {
    de: "LICHT",
    tr: "AÇIK",
    fr: "CLAIR",
    en: "LIGHT",
  };
  const modeLabel = isDark
    ? (darkLabels[language] ?? "DARK")
    : (lightLabels[language] ?? "LIGHT");

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
      <div className="pointer-events-none fixed right-2 max-lg:right-2 max-lg:top-16 max-lg:landscape:top-24 lg:top-0 z-50 flex flex-row justify-end items-start w-full" />
    );
  }

  return (
    <div className="pointer-events-none fixed right-2 max-lg:right-5.5 max-lg:top-15 max-lg:landscape:top-24.5 lg:top-0 z-50 flex flex-row items-stretch justify-end w-full">
      {/* Vertical mode label — letter by letter, same height as lamp */}
      <div
        className="pointer-events-auto max-lg:order-2 max-lg:ml-1.5 lg:order-1 lg:mr-2 flex flex-col items-center justify-between self-stretch gap-0"
        aria-hidden="true"
      >
        {modeLabel.split("").map((letter, i) => (
          <motion.span
            key={`${modeLabel}-${i}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25, ease: "easeOut" }}
            className={`block leading-none font-bold tracking-wider
              text-[8px] lg:text-[9px]
              ${
                isDark
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-amber-700/60 hover:text-amber-700"
              }
              transition-colors duration-300
            `}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Lamp column: bracket + swing */}
      <div className="pointer-events-auto max-lg:order-1 lg:order-2 flex flex-col items-center">
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
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Lamp shade SVG */}
            <svg
              width="36"
              height="30"
              viewBox="0 0 36 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md transition-all duration-300 group-hover:brightness-110"
            >
              {/* Shade body */}
              <path
                d="M13 4 L23 4 L35 24 L1 24 Z"
                fill={
                  isDark
                    ? "url(#shadeGradientDark)"
                    : "url(#shadeGradientLight)"
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
              {/* lamp.svg icon (replaces ellipse layers) */}
              <g
                transform="translate(7.5 33.6) scale(0.875 -0.875)"
                style={{ color: isDark ? "#f6d36a" : "#d4af37" }}
              >
                <g fill="none">
                  <path
                    fill="currentColor"
                    d="m10.211 20.106l-.223.447zm-1.067-4.42l-.462.19zm-.226-.452l-.395.306zm6.164 0l.395.306zM17.5 10c0 1.8-.865 3.4-2.204 4.403l.6.8A6.49 6.49 0 0 0 18.5 10zM12 4.5a5.5 5.5 0 0 1 5.5 5.5h1A6.5 6.5 0 0 0 12 3.5zM6.5 10A5.5 5.5 0 0 1 12 4.5v-1A6.5 6.5 0 0 0 5.5 10zm2.204 4.403A5.49 5.49 0 0 1 6.5 10h-1a6.49 6.49 0 0 0 2.604 5.203zm1.793 5.35a11.8 11.8 0 0 0-.891-4.258l-.924.382c.51 1.234.788 2.556.816 3.897zm3.068-.095a3.5 3.5 0 0 1-3.13 0l-.447.895a4.5 4.5 0 0 0 4.024 0zm.83-4.163a11.8 11.8 0 0 0-.892 4.259l1 .02c.027-1.341.305-2.663.815-3.897zm-.383 5.058a.89.89 0 0 0 .49-.779l-1-.02a.11.11 0 0 1 .063-.096zm-4.514-.779a.89.89 0 0 0 .49.779l.447-.895a.11.11 0 0 1 .062.095zm-1.394-4.57c.318.238.39.297.42.336l.79-.613c-.135-.174-.353-.33-.61-.524zm1.502.29c-.087-.21-.16-.396-.292-.567l-.79.613c.032.042.054.086.158.337zm5.69-1.09c-.257.192-.475.35-.61.523l.79.613c.03-.039.101-.098.42-.337zm.022 1.473c.104-.251.126-.295.159-.337l-.79-.613c-.133.171-.206.358-.293.568z"
                  />
                  <path
                    stroke="currentColor"
                    d="M14.5 16.5a6.73 6.73 0 0 1-5 0"
                    strokeWidth={isDark ? 1 : 1.35}
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    d="M11 14V9.75A1.25 1.25 0 1 0 9.75 11h4.5A1.25 1.25 0 1 0 13 9.75V14"
                    strokeWidth={isDark ? 1 : 1.35}
                  />
                </g>
              </g>
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
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
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
              tabIndex={-1}
            />
          </motion.div>
        </motion.div>
      </div>
      {/* /lamp column */}
    </div>
  );
}
