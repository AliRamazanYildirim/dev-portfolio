"use client";

import { useTranslation } from "@/hooks/useTranslation";
import {
  termsTranslations,
  type TermsDictionary,
} from "@/constants/translationsTerms";

type TermsSection = TermsDictionary["sections"][number];

function hasParagraphs(
  section: TermsSection,
): section is TermsSection & { paragraphs: ReadonlyArray<string> } {
  return (
    "paragraphs" in section &&
    Array.isArray((section as { paragraphs?: unknown }).paragraphs)
  );
}

function hasBullets(
  section: TermsSection,
): section is TermsSection & { bullets: ReadonlyArray<string> } {
  return (
    "bullets" in section &&
    Array.isArray((section as { bullets?: unknown }).bullets)
  );
}

export default function TermsPage() {
  const { language } = useTranslation();
  const terms = termsTranslations[language];

  return (
    <main className="w-full">
      <div className="mx-auto max-w-4xl px-5 py-16 md:px-10 text-zinc-600 dark:text-zinc-300">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
          {terms.title}
        </h1>
        <p className="mt-2 text-sm uppercase tracking-wide text-zinc-500">
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
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white md:text-3xl">
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
                <ul className="mt-4 space-y-3 list-disc list-inside text-base md:text-lg text-zinc-600 dark:text-zinc-300">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={`terms-section-${index}-bullet-${bulletIndex}`}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white md:text-3xl">
            {terms.contactHeading}
          </h2>
          <ul className="mt-4 space-y-3 text-base md:text-lg text-zinc-600 dark:text-zinc-300">
            {terms.contactDetails.map((detail, index) => (
              <li key={`terms-contact-${index}`}>{detail}</li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-sm text-zinc-500">{terms.note}</p>
      </div>
    </main>
  );
}
