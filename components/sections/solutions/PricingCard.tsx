"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface PricingCardProps {
  title: string;
  price: string;
  duration: string;
  includes: string[];
}

export default function PricingCard({ title, price, duration, includes }: PricingCardProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <div className="mb-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-3xl font-bold text-white md:text-4xl"
            >
              Investment & Timeline
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-zinc-400"
            >
              Transparent pricing with everything included
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#c58d12]/20 via-[#d4a24a]/20 to-[#c58d12]/20 opacity-60 blur-xl" />
            <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-8 transition-all duration-500 hover:border-[#c58d12]/50 lg:p-12">
              <div className="mb-8 flex items-start justify-between border-b border-zinc-800 pb-8">
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
                  <p className="flex items-center gap-2 text-zinc-400">
                    <svg className="h-5 w-5 text-[#c58d12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {duration}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-[#c58d12] to-[#d4a24a] bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
                    {price}
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">one-time</p>
                </div>
              </div>

              <div className="mb-10 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">What's included:</p>
                {includes.map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="group flex items-start gap-3"
                  >
                    <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[#c58d12]/50 bg-[#c58d12]/20 transition-colors group-hover:bg-[#c58d12]/30">
                      <svg className="h-3 w-3 text-[#c58d12]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="leading-relaxed text-zinc-300 transition-colors group-hover:text-white">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/#contact"
                  className="block w-full rounded-xl bg-gradient-to-r from-[#c58d12] to-[#d4a24a] px-6 py-4 text-center font-bold text-black shadow-[0_0_30px_rgba(197,141,18,0.3)] transition-all duration-300 hover:from-[#d4a24a] hover:to-[#c58d12] hover:shadow-[0_0_50px_rgba(197,141,18,0.5)]"
                >
                  Start This Project
                </Link>
              </motion.div>

              <p className="mt-6 text-center text-sm text-zinc-500">
                ✓ Dedicated post-launch support · ✓ Fixed price, no surprises
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
