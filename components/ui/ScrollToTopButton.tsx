"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    function updateFromScroll() {
      rafId = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        maxScrollable > 0
          ? Math.min(100, Math.round((scrollTop / maxScrollable) * 100))
          : 0;

      setProgress(pct);
      setVisible(scrollTop > 240);
    }

    function onScroll() {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateFromScroll);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const handleClick = () => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  // SVG circle values for progress ring
  const size = 44; // px
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = ((100 - progress) / 100) * circumference;

  return (
    <button
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={handleClick}
      className={`fixed right-1 bottom-6 z-60 flex items-center justify-center w-12 h-12 rounded-full md:w-14 md:h-14
        bg-linear-to-br from-amber-600 via-orange-500 to-red-700 text-white shadow-2xl
        ring-1 ring-white/10 hover:scale-105 active:scale-95 transform transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-indigo-300/40
        ${
          visible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
    >
      <span className="relative flex items-center justify-center w-full h-full">
        <svg
          className="absolute inset-0 m-auto"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="white"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dash}
            strokeLinecap="round"
            fill="none"
            style={{ transition: "stroke-dashoffset 200ms linear" }}
          />
        </svg>

        <svg
          className="relative w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M6 15l6-6 6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
