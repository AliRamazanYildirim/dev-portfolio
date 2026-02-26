"use client";

import { motion } from "framer-motion";

interface ContactInfoProps {
  phoneNumber?: string;
  email?: string;
  availabilityLabel?: string;
  badgeLabel?: string;
}

const ContactInfo = ({
  phoneNumber = "+49 151 67145187",
  email = "aliramazanyildirim@gmail.com",
  availabilityLabel = "Available Mon–Fri • 09:00–17:00 CET",
  badgeLabel = "Direct line",
}: ContactInfoProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="group flex w-full max-w-md items-center gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-5 py-4 shadow-xl transition-all duration-300 hover:border-[#c58d12]/50 hover:shadow-[0_0_24px_rgba(197,141,18,0.15)]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#c58d12] to-[#d4a24a] text-black shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.35 2.07.67 3.03a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.32 1.98.55 3.03.67A2 2 0 0 1 22 16.92z"
          />
        </svg>
      </span>
      <div className="flex flex-col text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c58d12]">
          {badgeLabel}
        </span>
        <a
          href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
          className="inline-block rounded px-2 py-1.5 text-lg font-semibold text-zinc-900 dark:text-white transition-colors duration-200 hover:text-[#c58d12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58d12]/40"
        >
          {phoneNumber}
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-block rounded px-2 py-1.5 text-sm text-zinc-500  decoration-zinc-600 underline-offset-2 transition-colors duration-200 hover:text-[#c58d12] hover:decoration-[#c58d12]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c58d12]/30"
        >
          {email}
        </a>
        <span className="text-sm text-zinc-500">{availabilityLabel}</span>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
