"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "next-themes";

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
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const isDark = resolvedTheme === "dark";

  const handleToggle = useCallback(async () => {
    // Cord stretch down then snap back
    cordControls.start({
      scaleY: [1, 1.35, 0.9, 1],
      transition: { duration: 0.4, ease: "easeOut" },
    });

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
      <div
        className="pointer-events-none fixed right-6 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center"
        style={{ width: 36 }}
      />
    );
  }

  return (
    <div className="fixed right-6 top-1/2 z-40 -translate-y-1/2">
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
        <div
          className={`w-px ${isDark ? "bg-zinc-500" : "bg-[#a08450]"}`}
          style={{ height: 24 }}
        />

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
              d="M4 4 L32 4 L28 24 L8 24 Z"
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
              x1="8"
              y1="24"
              x2="28"
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
          animate={cordControls}
          style={{ originY: "0%" }}
          className="flex flex-col items-center"
        >
          {/* Cord line */}
          <div
            className={`w-px ${isDark ? "bg-zinc-500" : "bg-[#a08450]"}`}
            style={{ height: 30 }}
          />

          {/* Pull knob */}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9, y: 4 }}
            className={`h-3 w-3 cursor-pointer rounded-full border transition-colors duration-300 ${
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
