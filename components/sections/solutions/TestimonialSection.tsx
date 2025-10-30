"use client";

import { motion } from "framer-motion";

interface TestimonialSectionProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export default function TestimonialSection({
  quote,
  author,
  role,
  company,
}: TestimonialSectionProps) {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
            className="absolute -top-8 -left-4 lg:-left-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="h-20 w-20 text-[#c58d12]/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.685.239-1.027.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.086.92-.354.373-.656.747-.893 1.188-.24.44-.403.922-.519 1.391-.297 1.02-.181 2.13-.181 2.13l3.708.022zM17 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.258 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.685.239-1.027.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.086.92-.354.373-.656.747-.893 1.188-.24.44-.403.922-.519 1.391-.297 1.02-.181 2.13-.181 2.13L17 10z" />
              </svg>
            </motion.div>
          </motion.div>

          <div className="relative overflow-hidden rounded-2xl border border-[#c58d12]/20 bg-gradient-to-br from-zinc-900/70 via-black/70 to-black/80 p-8 transition-all duration-500 hover:border-[#c58d12]/40 lg:p-12">
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c58d12]/5 via-transparent to-[#d4a24a]/5"
              animate={{ opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-bl from-[#c58d12]/20 to-transparent blur-3xl opacity-40 transition-opacity duration-500"
              animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10 mb-8 text-xl leading-relaxed text-zinc-100 italic lg:text-2xl"
            >
              “{quote}”
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative z-10 flex items-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#d4a24a]/50 bg-gradient-to-br from-[#c58d12] via-[#d4a24a] to-[#c58d12] text-lg font-bold text-black shadow-lg">
                  {author
                    .split(" ")
                    .map((name) => name[0] ?? "")
                    .join("")}
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-black bg-green-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <div>
                <p className="text-lg font-semibold text-white transition-colors hover:text-[#c58d12]">
                  {author}
                </p>
                <p className="text-sm text-zinc-400">
                  {role} · <span className="font-medium text-[#c58d12]">{company}</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-tl-full bg-gradient-to-tl from-[#c58d12]/15 to-transparent"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
