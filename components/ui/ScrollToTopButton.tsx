"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    let rafId = 0;

    function updateFromScroll() {
      rafId = 0;
      const nextVisible = (window.scrollY || 0) > 240;
      if (nextVisible !== visibleRef.current) {
        visibleRef.current = nextVisible;
        setVisible(nextVisible);
      }
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
    </button>
  );
}
