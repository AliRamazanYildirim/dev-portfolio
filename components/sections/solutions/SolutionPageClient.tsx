"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import {
  solutionDetails,
  type SolutionSlug,
} from "@/constants/solutionsContent";
import SolutionHero from "@/components/sections/solutions/SolutionHero";
import BenefitCard from "@/components/sections/solutions/BenefitCard";
import TestimonialSection from "@/components/sections/solutions/TestimonialSection";
import PricingTiers from "@/components/sections/solutions/PricingTiers";
import SolutionCTA from "@/components/sections/solutions/SolutionCTA";

interface SolutionPageClientProps {
  slug: SolutionSlug;
}

export default function SolutionPageClient({ slug }: SolutionPageClientProps) {
  const { language } = useTranslation();
  const dictionary = solutionDetails[language] ?? solutionDetails.en;
  const fallbackDictionary = solutionDetails.en;
  const fallbackContent = fallbackDictionary[slug];
  const content = dictionary[slug] ?? fallbackContent;
  const resolved = content ?? fallbackContent;

  if (!fallbackContent) {
    return null;
  }

  const copy = {
    benefitsHeading: {
      en: "Key Benefits",
      de: "Wichtigste Vorteile",
      tr: "Öne Çıkan Faydalar",
    },
    benefitsSubtitle: {
      en: "Discover the highlights of this solution and why teams rely on it to deliver results.",
      de: "Erfahren Sie, warum Teams dieser Lösung vertrauen, um messbare Ergebnisse zu erzielen.",
      tr: "Bu çözümün öne çıkan özelliklerini ve ekiplerin neden sonuç almak için ona güvendiğini keşfedin.",
    },
  } as const;

  const tiers = [
    resolved.pricing.starter && {
      name: "Starter",
      ...resolved.pricing.starter,
    },
    resolved.pricing.professional && {
      name: "Professional",
      ...resolved.pricing.professional,
    },
    resolved.pricing.enterprise && {
      name: "Enterprise",
      ...resolved.pricing.enterprise,
    },
  ].filter(Boolean) as Array<{
    name: string;
    price: string;
    duration: string;
    description: string;
    features: string[];
    highlighted?: boolean;
    badge?: string;
  }>;

  return (
    <main className="min-h-screen bg-linear-to-b from-black via-zinc-950 to-black">
      <motion.div
        className="pointer-events-none fixed top-1/3 left-1/4 h-96 w-96 rounded-full bg-linear-to-br from-[#c58d12] to-[#d4a24a] opacity-10 blur-[150px]"
        animate={{ y: [0, -50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none fixed bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-linear-to-tr from-[#d4a24a] to-[#c58d12] opacity-10 blur-[150px]"
        animate={{ y: [0, 50, 0], scale: [1.1, 0.95, 1.1] }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="pointer-events-none fixed right-1/3 top-10 h-80 w-80 rounded-full bg-[#c58d12]/20 opacity-10 blur-[120px]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10">
        <SolutionHero
          title={resolved.hero.title}
          subtitle={resolved.hero.subtitle}
          cta={resolved.hero.cta}
        />

        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
                {copy.benefitsHeading[language] ?? copy.benefitsHeading.en}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-400">
                {copy.benefitsSubtitle[language] ?? copy.benefitsSubtitle.en}
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {resolved.benefits.map((benefit, index) => (
                <BenefitCard
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                  icon={benefit.icon}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <TestimonialSection
          quote={resolved.testimonial.quote}
          author={resolved.testimonial.author}
          role={resolved.testimonial.role}
          company={resolved.testimonial.company}
        />

        {tiers.length > 0 && <PricingTiers tiers={tiers} currency="€" />}

        <SolutionCTA
          title={resolved.cta.title}
          subtitle={resolved.cta.subtitle}
          button={resolved.cta.button}
        />
      </div>
    </main>
  );
}
