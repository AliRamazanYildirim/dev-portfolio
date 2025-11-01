"use client";

import { motion } from "framer-motion";
import NoiseBackground from "../NoiseBackground";

interface ContactInfoProps {
  phoneNumber?: string;
  email?: string;
  availabilityLabel?: string;
  badgeLabel?: string;
}

const MotionNoiseBackground = motion.create(NoiseBackground);

const ContactInfo = ({
  phoneNumber = "+49 151 67145187",
  email = "aliramazanyildirim@gmail.com",
  availabilityLabel = "Available Mon–Fri • 09:00–17:00 CET",
  badgeLabel = "Direct line",
}: ContactInfoProps) => {
  return (
    <MotionNoiseBackground
      mode="light"
      intensity={0.08}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="group flex w-full max-w-md items-center gap-4 rounded-2xl border border-slate-300 bg-white/95 px-5 py-4 shadow-xl transition-shadow duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/70 hover:shadow-2xl"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
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
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {badgeLabel}
        </span>
        <a
          href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
          className="inline-block rounded px-2 py-1.5 text-lg font-semibold text-slate-900 transition-colors duration-200 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
        >
          {phoneNumber}
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-block rounded px-2 py-1.5 text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition-colors duration-200 hover:text-slate-800 hover:decoration-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600/30"
        >
          {email}
        </a>
        <span className="text-sm text-slate-500">{availabilityLabel}</span>
      </div>
      <span className="ml-auto hidden h-9 w-9 items-center justify-center rounded-full border border-slate-400 text-slate-400 transition-colors duration-200 group-hover:border-slate-600 group-hover:text-slate-600 sm:flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </span>
    </MotionNoiseBackground>
  );
};

export default ContactInfo;
