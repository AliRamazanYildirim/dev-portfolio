"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface BenefitCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

export default function BenefitCard({
  title,
  description,
  icon,
  index,
}: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/80 to-black/80 p-8 backdrop-blur">
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c58d12]/0 via-[#c58d12]/0 to-[#c58d12]/0 group-hover:from-[#c58d12]/10 group-hover:via-[#c58d12]/15 group-hover:to-[#c58d12]/5"
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#c58d12]/20 to-[#d4a24a]/10 blur-2xl opacity-0 group-hover:opacity-100"
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-[#c58d12]/30 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ scale: 0, rotate: -90 }}
          whileHover={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 280 }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            className="relative mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-[#c58d12]/40 bg-gradient-to-br from-[#c58d12]/25 to-[#d4a24a]/10"
            whileHover={{ boxShadow: "0 0 30px rgba(197,141,18,0.55)" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#c58d12]/40 to-transparent"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10 flex items-center justify-center"
            >
              <Image
                src={icon}
                alt={title}
                width={32}
                height={32}
                className="h-8 w-8 object-contain opacity-90 transition-opacity group-hover:opacity-100"
              />
            </motion.div>
          </motion.div>

          <h3 className="mb-4 text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#c58d12] md:text-2xl">
            {title}
          </h3>

          <p className="text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">
            {description}
          </p>

          <motion.div
            className="pointer-events-none absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#c58d12] via-[#d4a24a] to-transparent"
            initial={{ width: "0%", opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: "easeOut" }}
          />

          <motion.div
            className="pointer-events-none absolute bottom-8 right-4 h-2 w-2 rounded-full bg-[#c58d12] opacity-0 group-hover:opacity-70"
            animate={{ y: [0, -20, 0], scale: [1, 1.4, 1], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
