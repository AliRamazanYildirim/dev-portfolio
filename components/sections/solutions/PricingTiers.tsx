"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

interface PricingTier {
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

interface PricingTiersProps {
  tiers: PricingTier[];
  currency?: string;
}

export default function PricingTiers({ tiers, currency = "€" }: PricingTiersProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <motion.div
            className="mb-4 inline-block"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-full border border-[#c58d12]/30 bg-[#c58d12]/10 px-4 py-1.5">
              <span className="text-sm font-semibold tracking-widest text-[#c58d12]">TRANSPARENT PRICING</span>
            </div>
          </motion.div>

          <h2 className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Investment Options
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Choose the package that matches your roadmap. Every tier includes regular status updates and a production-ready launch.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-6">
          {tiers.map((tier, index) => {
            const isHighlighted = Boolean(tier.highlighted);
            const cardGlow =
              "absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#c58d12]/40 via-[#d4a24a]/30 to-[#c58d12]/40 blur-3xl";

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative cursor-pointer ${isHighlighted ? "md:-mt-6 md:mb-6" : ""}`}
              >
                {isHighlighted && (
                  <motion.div
                    className={cardGlow}
                    animate={{ opacity: hoveredIndex === index ? [0.25, 0.5, 0.25] : 0.25 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <div
                  className={`relative h-full rounded-3xl border-2 p-8 transition-all duration-500 backdrop-blur-xl lg:p-10 ${
                    isHighlighted
                      ? "border-[#c58d12]/60 bg-gradient-to-br from-zinc-900/95 via-black/90 to-zinc-900/95 shadow-[0_0_60px_rgba(197,141,18,0.45)]"
                      : "border-zinc-800/60 bg-gradient-to-br from-zinc-900/70 to-black/70 hover:border-[#c58d12]/40 hover:shadow-[0_0_40px_rgba(197,141,18,0.25)]"
                  } ${hoveredIndex === index ? "-translate-y-2 scale-[1.02]" : ""}`}
                >
                  {tier.badge && (
                    <motion.div
                      className="absolute -top-5 left-1/2 z-20 -translate-x-1/2"
                      initial={{ scale: 0, rotate: -120 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c58d12] via-[#d4a24a] to-[#c58d12] px-5 py-2 text-xs font-bold uppercase text-black shadow-[0_0_30px_rgba(197,141,18,0.45)]">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {tier.badge}
                      </div>
                    </motion.div>
                  )}

                  <div className="relative z-10 mb-8">
                    <h3 className={`text-2xl font-bold md:text-3xl ${isHighlighted ? "text-[#c58d12]" : "text-white"}`}>
                      {tier.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tier.description}</p>
                  </div>

                  <div className="relative z-10 mb-10 border-b border-zinc-800/50 pb-10">
                    <div className="flex items-baseline gap-3">
                      <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                        {currency}
                        {tier.price}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                      <svg className="h-5 w-5 text-[#c58d12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tier.duration}
                    </p>
                  </div>

                  <div className="relative z-10 mb-10 space-y-4">
                    {tier.features.map((feature) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="group flex items-start gap-4"
                      >
                        <div
                          className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border text-sm transition ${
                            isHighlighted
                              ? "border-[#c58d12]/50 bg-gradient-to-br from-[#c58d12] to-[#d4a24a] text-black"
                              : "border-zinc-700/60 bg-zinc-800/60 text-zinc-300"
                          } group-hover:scale-110`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className={`leading-relaxed transition-colors ${isHighlighted ? "text-zinc-100" : "text-zinc-400"} group-hover:text-white`}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative z-10">
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-xl blur transition opacity-0 ${hoveredIndex === index ? "opacity-100" : ""} ${
                        isHighlighted ? "bg-gradient-to-r from-[#c58d12]/20 to-[#d4a24a]/20" : "bg-gradient-to-r from-[#c58d12]/10 to-transparent"
                      }`}
                    />
                    <Link
                      href="/#contact"
                      className={`relative block w-full rounded-xl px-6 py-4 text-center text-sm font-bold uppercase tracking-wide transition ${
                        isHighlighted
                          ? "bg-gradient-to-r from-[#c58d12] to-[#d4a24a] text-black shadow-[0_0_30px_rgba(197,141,18,0.45)] hover:shadow-[0_0_50px_rgba(197,141,18,0.6)]"
                          : "border border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-700 text-white hover:border-[#c58d12]/50 hover:from-[#c58d12]/20 hover:to-[#d4a24a]/20"
                      }`}
                    >
                      {isHighlighted ? "Start Now" : "Get Started"}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 border-t border-zinc-800/50 pt-12 text-center"
        >
          <p className="flex flex-wrap items-center justify-center gap-8 text-sm">
            {["No hidden fees", "Dedicated post-launch support", "Flexible payment plans"].map((item) => (
              <span key={item} className="rounded-full border border-[#c58d12]/20 bg-[#c58d12]/5 px-4 py-2 text-zinc-300 transition-colors hover:border-[#c58d12]/40 hover:text-[#c58d12]">
                {item}
              </span>
            ))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
