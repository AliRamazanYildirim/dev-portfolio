"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HeroProcessModalContent } from "@/constants/translationsHero";

interface ProcessExperienceModalProps {
  open: boolean;
  onClose: () => void;
  content: HeroProcessModalContent;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 24 },
};

export default function ProcessExperienceModal({
  open,
  onClose,
  content,
}: ProcessExperienceModalProps) {
  const steps = content?.steps ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileCarousel, setIsMobileCarousel] = useState(false);
  const [isLandscapeMobileViewport, setIsLandscapeMobileViewport] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset index when modal opens
      setActiveIndex(0);
    }
  }, [open, steps.length]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp index to valid range
    setActiveIndex((index) => Math.min(index, Math.max(steps.length - 1, 0)));
  }, [steps.length]);

  useEffect(() => {
    const mobileWidthQuery = window.matchMedia("(max-width: 767px)");
    const landscapeMobileQuery = window.matchMedia(
      "(hover: none) and (pointer: coarse) and (orientation: landscape) and (max-height: 500px)",
    );
    const handleChange = () => {
      const isLandscapeMobile = landscapeMobileQuery.matches;
      setIsLandscapeMobileViewport(isLandscapeMobile);
      setIsMobileCarousel(mobileWidthQuery.matches || isLandscapeMobile);
    };

    handleChange();
    mobileWidthQuery.addEventListener("change", handleChange);
    landscapeMobileQuery.addEventListener("change", handleChange);

    return () => {
      mobileWidthQuery.removeEventListener("change", handleChange);
      landscapeMobileQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!open || !isMobileCarousel || steps.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % steps.length);
    }, 9000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [open, isMobileCarousel, steps.length]);

  const currentIndex =
    steps.length > 0 ? Math.min(activeIndex, steps.length - 1) : 0;
  const activeStep = steps.length > 0 ? steps[currentIndex] : null;

  const progress = useMemo(() => {
    if (!steps.length) {
      return 0;
    }
    return ((currentIndex + 1) / steps.length) * 100;
  }, [currentIndex, steps.length]);

  if (!content || !activeStep) {
    return null;
  }

  const { title, subtitle, closeLabel, navigation } = content;

  const navJumpTo = navigation?.jumpTo ?? "Jump to phase";
  const navProgress = navigation?.progress ?? "Progress";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-999 flex items-start justify-center overflow-y-auto bg-[#090604]/80 backdrop-blur-md ${
            isLandscapeMobileViewport ? "py-3" : "md:items-center"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="process-modal-title"
          aria-describedby="process-modal-subtitle"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className={`relative w-[min(980px,calc(100vw-3rem))] rounded-3xl border border-white/10 bg-linear-to-br from-[#1a1006] via-[#24160a] to-[#321c0b] text-white shadow-2xl ${
              isLandscapeMobileViewport
                ? "max-h-[94dvh] overflow-y-auto"
                : "overflow-hidden md:h-[90vh]"
            }`}
            variants={containerVariants}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#f6b84e]/10 blur-3xl" />
              <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-[#f9e2b0]/10 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_55%)]" />
            </div>

            <div
              className={`relative z-10 flex flex-col ${
                isLandscapeMobileViewport ? "h-auto" : "h-full"
              }`}
            >
              <header className="border-b border-white/10 px-4 py-4 md:px-8 md:pb-6 md:pt-8">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-3">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.45em] text-[#f5d9a6]">
                      {title}
                    </span>
                    <h2
                      id="process-modal-title"
                      className="text-md font-semibold leading-tight md:text-[26px]"
                    >
                      {subtitle}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={closeLabel}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-[#f5d9a6] transition hover:border-white/40 hover:bg-white/20"
                  >
                    {closeLabel}
                  </button>
                </div>
              </header>

              <div className="relative flex-1 px-8 pb-12 pt-3">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
                <div className="absolute right-8 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />

                <div className="relative z-10 flex h-full flex-col gap-3">
                  <div
                    className={`${isMobileCarousel ? "hidden" : "block"} space-y-4`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-[0.45em] text-[#f6c268]">
                        {activeStep.stage}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-white/70">
                        <span>{navProgress}</span>
                        <span>
                          {currentIndex + 1} / {steps.length}
                        </span>
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full bg-linear-to-r from-[#f6c268] to-[#f9e2b0]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                    <h3
                      className="text-2xl font-semibold leading-snug text-white md:text-[24px]"
                      aria-live="polite"
                    >
                      {activeStep.title}
                    </h3>
                  </div>

                  <div
                    className={`relative flex-1 overflow-hidden ${
                      isMobileCarousel ? "hidden" : "block"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep.title}
                        className="relative h-full"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 px-6 py-8 md:px-10 md:py-10">
                          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#f6b84e]/20 blur-3xl" />
                          <div className="relative flex h-full flex-col gap-8 md:flex-row md:gap-12">
                            <div className="space-y-6 text-sm md:text-base text-[#f9f4eb] md:w-2/3">
                              <p className="leading-relaxed text-white/90">
                                {activeStep.description}
                              </p>
                              <div className="grid gap-3 md:grid-cols-2">
                                {activeStep.highlights.map((highlight) => (
                                  <div
                                    key={highlight}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/80"
                                  >
                                    {highlight}
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-[#f5d9a6]">
                                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 uppercase tracking-[0.25em]">
                                  {activeStep.duration}
                                </span>
                                <span className="rounded-full border border-white/20 bg-linear-to-r from-[#f6c268]/30 to-transparent px-4 py-2">
                                  {activeStep.outcome}
                                </span>
                              </div>
                            </div>
                            <div className="flex w-full flex-col gap-6 rounded-3xl border border-white/10 bg-black/20 p-6 text-xs text-white/70 md:w-1/3">
                              <div className="space-y-3">
                                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f5d9a6]">
                                  {navJumpTo}
                                </span>
                                <p className="text-sm text-white/75">
                                  {activeStep.outcome}
                                </p>
                              </div>
                              <div className="grid gap-2">
                                {steps.map((step, index) => (
                                  <button
                                    key={step.stage}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className={`flex items-center justify-between rounded-full border px-4 py-2 transition ${
                                      index === currentIndex
                                        ? "border-[#f6c268] bg-[#f6c268]/25 text-white"
                                        : "border-white/10 bg-white/5 text-white/70 hover:border-[#f6c268]/40 hover:text-white"
                                    }`}
                                    aria-label={`${step.stage} ${step.title}`}
                                  >
                                    <span className="text-xs font-medium uppercase tracking-[0.3em]">
                                      {step.stage}
                                    </span>
                                    <span className="ml-3 text-[10px] opacity-70">
                                      {index + 1}/{steps.length}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className={isMobileCarousel ? "block" : "hidden"}>
                    <div className="-mx-4 px-4">
                      <div className="overflow-hidden">
                        <motion.div
                          className="flex"
                          animate={{ x: `-${currentIndex * 100}%` }}
                          transition={{ duration: 0.9, ease: "easeInOut" }}
                        >
                          {steps.map((step) => (
                            <div
                              key={step.stage}
                              className="w-full shrink-0 px-1 py-2"
                            >
                              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6">
                                <div className="space-y-4">
                                  <div className="flex flex-col gap-2">
                                    <span className="text-xs uppercase tracking-[0.4em] text-[#f6c268]">
                                      {step.stage}
                                    </span>
                                    <h3 className="text-xl font-semibold text-white">
                                      {step.title}
                                    </h3>
                                  </div>
                                  <p className="text-sm leading-relaxed text-white/85">
                                    {step.description}
                                  </p>
                                  <div className="space-y-2">
                                    {step.highlights.map((highlight) => (
                                      <div
                                        key={highlight}
                                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80"
                                      >
                                        {highlight}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#f5d9a6]">
                                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 uppercase tracking-[0.25em]">
                                      {step.duration}
                                    </span>
                                    <span className="rounded-full border border-white/15 bg-linear-to-r from-[#f6c268]/20 to-transparent px-4 py-2 text-white/90">
                                      {step.outcome}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-4 h-px w-full bg-white/20" />
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                      <div className="mt-5 flex items-center justify-center gap-2">
                        {steps.map((step, index) => (
                          <button
                            key={step.stage}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentIndex
                                ? "w-8 bg-[#f6c268]"
                                : "w-3 bg-white/25 hover:bg-white/40"
                            }`}
                            aria-label={`${step.stage} ${step.title}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile view renders stacked phases; desktop navigation already handled above */}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
