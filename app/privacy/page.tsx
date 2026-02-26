"use client";

import { useTranslation } from "@/hooks/useTranslation";
import {
  privacyTranslations,
  type PrivacyDictionary,
} from "@/constants/translationsPrivacy";

type PrivacySection = PrivacyDictionary["sections"][number];

function hasParagraphs(
  section: PrivacySection,
): section is PrivacySection & { paragraphs: ReadonlyArray<string> } {
  return (
    "paragraphs" in section &&
    Array.isArray((section as { paragraphs?: unknown }).paragraphs)
  );
}

function hasBullets(
  section: PrivacySection,
): section is PrivacySection & { bullets: ReadonlyArray<string> } {
  return (
    "bullets" in section &&
    Array.isArray((section as { bullets?: unknown }).bullets)
  );
}

export default function PrivacyPage() {
  const { language } = useTranslation();
  const privacy = privacyTranslations[language];

  return (
    <main className="w-full">
      <div className="mx-auto max-w-4xl px-5 py-16 md:px-10 text-zinc-300">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl bg-linear-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          {privacy.title}
        </h1>
        <p className="mt-2 text-sm uppercase tracking-wide text-zinc-500">
          {privacy.lastUpdated}
        </p>

        <div className="mt-8 space-y-5 text-base leading-relaxed md:text-lg">
          {privacy.intro.map((paragraph, index) => (
            <p key={`privacy-intro-${index}`}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 space-y-10">
          {privacy.sections.map((section, index) => (
            <section key={`privacy-section-${index}`}>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                {section.heading}
              </h2>
              {hasParagraphs(section) && (
                <div className="mt-4 space-y-4 text-base leading-relaxed md:text-lg">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      key={`privacy-section-${index}-paragraph-${paragraphIndex}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {hasBullets(section) && (
                <ul className="mt-4 space-y-3 list-disc list-inside text-base md:text-lg text-zinc-300">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={`privacy-section-${index}-bullet-${bulletIndex}`}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            {privacy.contactHeading}
          </h2>
          <ul className="mt-4 space-y-3 text-base md:text-lg text-zinc-300">
            {privacy.contactDetails.map((detail, index) => (
              <li key={`privacy-contact-${index}`}>{detail}</li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-sm text-zinc-500">{privacy.note}</p>
      </div>
    </main>
  );
}
