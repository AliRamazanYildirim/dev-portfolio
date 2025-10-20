"use client";

import NoiseBackground from "@/components/NoiseBackground";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationDictionary } from "@/constants/translations";

type TermsSection = TranslationDictionary["terms"]["sections"][number];

function hasParagraphs(
  section: TermsSection
): section is TermsSection & { paragraphs: ReadonlyArray<string> } {
  return (
    "paragraphs" in section &&
    Array.isArray((section as { paragraphs?: unknown }).paragraphs)
  );
}

function hasBullets(
  section: TermsSection
): section is TermsSection & { bullets: ReadonlyArray<string> } {
  return (
    "bullets" in section &&
    Array.isArray((section as { bullets?: unknown }).bullets)
  );
}

export default function TermsPage() {
  const { dictionary } = useTranslation();
  const terms = dictionary.terms;

  return (
    <main className="w-full">
      <NoiseBackground mode="light" intensity={0.1}>
        <div className="mx-auto max-w-4xl px-5 py-16 md:px-10 text-[#260a03]">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {terms.title}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-wide text-neutral-600">
            {terms.lastUpdated}
          </p>

          <div className="mt-8 space-y-5 text-base leading-relaxed md:text-lg">
            {terms.intro.map((paragraph, index) => (
              <p key={`terms-intro-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 space-y-10">
            {terms.sections.map((section, index) => (
              <section key={`terms-section-${index}`}>
                <h2 className="text-2xl font-semibold text-[#180a04] md:text-3xl">
                  {section.heading}
                </h2>
                {hasParagraphs(section) && (
                  <div className="mt-4 space-y-4 text-base leading-relaxed md:text-lg">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p
                        key={`terms-section-${index}-paragraph-${paragraphIndex}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                {hasBullets(section) && (
                  <ul className="mt-4 space-y-3 list-disc list-inside text-base md:text-lg text-[#3a2018]">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={`terms-section-${index}-bullet-${bulletIndex}`}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-[#180a04] md:text-3xl">
              {terms.contactHeading}
            </h2>
            <ul className="mt-4 space-y-3 text-base md:text-lg text-[#3a2018]">
              {terms.contactDetails.map((detail, index) => (
                <li key={`terms-contact-${index}`}>{detail}</li>
              ))}
            </ul>
          </section>

          <p className="mt-12 text-sm text-neutral-600">{terms.note}</p>
        </div>
      </NoiseBackground>
    </main>
  );
}
