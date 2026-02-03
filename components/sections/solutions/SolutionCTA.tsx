"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface SolutionCTAProps {
  title: string;
  subtitle: string;
  button: string;
}

export default function SolutionCTA({ title, subtitle, button }: SolutionCTAProps) {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 flex justify-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-[#c58d12]/40"
            >
                <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="h-16 w-16 rounded-full border border-[#c58d12]/60 bg-linear-to-br from-[#c58d12]/30 to-[#d4a24a]/20 shadow-[0_0_30px_rgba(197,141,18,0.4)]"
              />
            </motion.div>
          </div>

            <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          >
            <span className="bg-linear-to-r from-white via-[#d4a24a] to-white bg-clip-text text-transparent">{title}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
          >
            {subtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 380, damping: 18 }}>
                <Link
                href="/#contact"
                className="inline-flex items-center gap-3 rounded-xl border border-[#d4a24a]/30 bg-linear-to-r from-[#c58d12] to-[#d4a24a] px-10 py-5 text-lg font-bold text-black shadow-[0_0_50px_rgba(197,141,18,0.4)] transition-all duration-300 hover:border-[#d4a24a]/80 hover:from-[#d4a24a] hover:to-[#c58d12] hover:shadow-[0_0_80px_rgba(197,141,18,0.6)]"
              >
                <span>{button}</span>
                <motion.svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm"
          >
            {[
              "Free consultation",
              "No commitment",
              "Response in 24h",
            ].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-3 rounded-lg border border-[#c58d12]/30 bg-[#c58d12]/10 px-4 py-2 text-zinc-300 transition-colors hover:border-[#c58d12]/60"
              >
                <motion.svg
                  className="h-5 w-5 text-[#c58d12]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </motion.svg>
                <span>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
