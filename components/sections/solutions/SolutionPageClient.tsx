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
      fr: "Avantages cles",
    },
    benefitsSubtitle: {
      en: "Discover the highlights of this solution and why teams rely on it to deliver results.",
      de: "Erfahren Sie, warum Teams dieser Lösung vertrauen, um messbare Ergebnisse zu erzielen.",
      tr: "Bu çözümün öne çıkan özelliklerini ve ekiplerin neden sonuç almak için ona güvendiğini keşfedin.",
      fr: "Decouvrez les points forts de cette solution et pourquoi les equipes lui font confiance pour obtenir des resultats.",
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
    <main className="min-h-screen bg-transparent">
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
