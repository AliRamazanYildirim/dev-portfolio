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
  const { language, dictionary } = useTranslation();
  const contentDictionary = solutionDetails[language] ?? solutionDetails.en;
  const fallbackContentDictionary = solutionDetails.en;
  const fallbackContent = fallbackContentDictionary[slug];
  const content = contentDictionary[slug] ?? fallbackContent;
  const resolved = content ?? fallbackContent;
  const solutionPageCopy = dictionary.solutionPage;
  const pricingTiersCopy = dictionary.pricingTiers;

  if (!fallbackContent) {
    return null;
  }

  const tiers = [
    resolved.pricing.starter && {
      name: pricingTiersCopy.tierStarter,
      ...resolved.pricing.starter,
    },
    resolved.pricing.professional && {
      name: pricingTiersCopy.tierProfessional,
      ...resolved.pricing.professional,
    },
    resolved.pricing.enterprise && {
      name: pricingTiersCopy.tierEnterprise,
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

        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white md:text-5xl">
                {solutionPageCopy.benefitsHeading}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
                {solutionPageCopy.benefitsSubtitle}
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
