"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function SolutionsPage() {
  const { language, dictionary } = useTranslation();
  const solutions = dictionary.nav.solutions.items;
  const copy = {
    heroTitle: {
      en: "Solutions Built for Growth",
      de: "Lösungen für Wachstum",
      tr: "Büyüme için Çözümler",
      fr: "Des solutions pour grandir",
    },
    heroSubtitle: {
      en: "From lead generation to team training—everything you need to scale your online presence with confidence.",
      de: "Von Lead-Generierung bis Team-Schulung – alles, was Sie brauchen, um Ihre Online-Präsenz selbstbewusst zu skalieren.",
      tr: "Lead üretiminden ekip eğitimine – çevrimiçi varlığınızı güvenle büyütmeniz için gereken her şey.",
      fr: "De la generation de leads a la formation d equipe: tout ce qu il faut pour faire grandir votre presence en ligne avec confiance.",
    },
    learnMore: {
      en: "Learn more",
      de: "Mehr erfahren",
      tr: "Daha fazla",
      fr: "En savoir plus",
    },
    ctaTitle: {
      en: "Not sure which solution fits?",
      de: "Unsicher, welche Lösung passt?",
      tr: "Hangi çözümün uygun olduğundan emin değil misiniz?",
      fr: "Vous ne savez pas quelle solution choisir ?",
    },
    ctaSubtitle: {
      en: "Book a free 30-minute consultation and we will shape a roadmap that matches your goals.",
      de: "Buchen Sie ein kostenloses 30-minütiges Gespräch und wir erstellen eine Roadmap passend zu Ihren Zielen.",
      tr: "Ücretsiz 30 dakikalık bir görüşme ayırtın, hedeflerinize uygun bir yol haritası hazırlayalım.",
      fr: "Reservez une consultation gratuite de 30 minutes et construisons une feuille de route adaptee a vos objectifs.",
    },
    ctaButton: {
      en: "Book Free Consultation",
      de: "Kostenlose Beratung buchen",
      tr: "Ücretsiz görüşme ayırt",
      fr: "Reserver une consultation gratuite",
    },
  } as const;

  return (
    <main className="min-h-screen">
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-6 inline-block"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="rounded-full border border-[#c58d12]/30 bg-[#c58d12]/10 px-4 py-1.5">
                <span className="text-sm font-medium tracking-wide text-[#c58d12]">
                  PREMIUM SOLUTIONS
                </span>
              </div>
            </motion.div>

            <h1 className="mb-6 bg-linear-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-4xl font-bold text-transparent leading-tight md:text-6xl lg:text-7xl">
              {copy.heroTitle[language]}
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-zinc-400 md:text-xl lg:text-2xl">
              {copy.heroSubtitle[language]}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {solutions.map((solution) => (
            <motion.div
              key={solution.slug ?? solution.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Link href={solution.href} className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-black p-8 transition-all duration-500 hover:border-[#c58d12]/50">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#c58d12]/0 via-[#c58d12]/0 to-[#c58d12]/0 transition-all duration-500 group-hover:from-[#c58d12]/6 group-hover:via-[#c58d12]/10 group-hover:to-[#c58d12]/6" />
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-linear-to-br from-[#c58d12]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-[#c58d12]/30 bg-linear-to-br from-[#c58d12]/20 to-[#c58d12]/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Image
                        src={solution.icon}
                        alt={solution.alt ?? solution.title}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </div>

                    <h3 className="mb-4 text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#c58d12] md:text-2xl">
                      {solution.title}
                    </h3>

                    <p className="mb-6 text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">
                      {solution.description}
                    </p>

                    <div className="flex items-center gap-2 font-semibold text-[#c58d12] transition-all duration-300 group-hover:gap-3">
                      <span>{copy.learnMore[language]}</span>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-[#c58d12] to-transparent transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-linear-to-b from-black via-zinc-950 to-black py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
              {copy.ctaTitle[language]}
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 md:text-xl">
              {copy.ctaSubtitle[language]}
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-[#c58d12] to-[#d4a24a] px-10 py-5 text-lg font-bold text-black shadow-[0_0_50px_rgba(197,141,18,0.4)] transition-all duration-300 hover:from-[#d4a24a] hover:to-[#c58d12] hover:shadow-[0_0_80px_rgba(197,141,18,0.6)]"
              >
                <span>{copy.ctaButton[language]}</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
