"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface SolutionHeroProps {
  title: string;
  subtitle: string;
  cta: string;
}

export default function SolutionHero({
  title,
  subtitle,
  cta,
}: SolutionHeroProps) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6 inline-block"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="rounded-full border border-[#c58d12]/40 bg-linear-to-r from-[#c58d12]/20 to-[#d4a24a]/10 px-4 py-1.5 backdrop-blur"
              whileHover={{
                boxShadow: "0 0 20px rgba(197,141,18,0.5)",
                borderColor: "rgba(197,141,18,0.6)",
              }}
              transition={{ type: "spring", stiffness: 280 }}
            >
              <span className="text-sm font-medium tracking-wider text-[#c58d12]">
                PREMIUM SOLUTION
              </span>
            </motion.div>
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            <motion.span
              className="inline-block bg-linear-to-r from-white via-[#d4a24a] to-white bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% center", "100% center"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{ backgroundSize: "200% 100%" }}
            >
              {title}
            </motion.span>
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-zinc-400 md:text-xl lg:text-2xl">
            {subtitle}
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 rounded-lg bg-linear-to-r from-[#c58d12] to-[#d4a24a] px-8 py-4 font-semibold text-black shadow-[0_0_40px_rgba(197,141,18,0.35)] transition-all duration-300 hover:from-[#d4a24a] hover:to-[#c58d12] hover:shadow-[0_0_60px_rgba(197,141,18,0.5)]"
            >
              <span>{cta}</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-10 w-6 rounded-full border-2 border-[#c58d12]/50 p-1.5">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto h-1.5 w-1.5 rounded-full bg-linear-to-b from-[#d4a24a] to-[#c58d12]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
