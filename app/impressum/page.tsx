"use client";

import { Metadata } from "next";
import NoiseBackground from "@/components/ui/NoiseBackground";
import { useTranslation } from "@/hooks/useTranslation";
import { imprintTranslations } from "@/constants/translationsImprint";
import Link from "next/link";
import Script from "next/script";

// JSON-LD Structured Data for SEO
function generateStructuredData(language: "en" | "de" | "tr") {
  const imprint = imprintTranslations[language];
  const sections = imprint.sections;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: sections.provider.content.name,
    jobTitle: imprint.structuredData.jobTitle,
    url: `https://www.arytechsolutions.com/${language === "de" ? "" : language + "/"}impressum`,
    image: "https://www.arytechsolutions.com/profile-image.jpg",
    email: sections.contact.email.value,
    telephone: sections.contact.phone.value,
    address: {
      "@type": "PostalAddress",
      streetAddress: sections.provider.content.street,
      addressLocality: "Sasbach",
      postalCode: "77880",
      addressCountry: "DE",
    },
    sameAs: [
      "https://www.linkedin.com/in/aliramazanyildirim",
      "https://github.com/aliramazanyildirim",
      "https://medium.com/@aliramazanyildirim",
    ],
    knowsAbout: [
      "Web Development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Full-Stack Development",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Self-employed",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Professional Liability Insurance",
      recognizedBy: {
        "@type": "Organization",
        name: sections.insurance.provider.value,
      },
    },
  };
}

export default function ImpressumPage() {
  const { language } = useTranslation();
  const imprint = imprintTranslations[language];
  const sections = imprint.sections;

  const structuredData = generateStructuredData(language);

  return (
    <>
      <Script
        id="impressum-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="w-full">
        <NoiseBackground mode="light" intensity={0.1}>
          <article
            className="mx-auto max-w-4xl px-5 py-16 md:px-10 text-[#260a03]"
            itemScope
            itemType="https://schema.org/WebPage"
          >
            {/* Header */}
            <header>
              <h1
                className="text-4xl font-semibold tracking-tight md:text-5xl"
                itemProp="name"
              >
                {imprint.title}
              </h1>
              <p className="mt-2 text-sm uppercase tracking-wide text-neutral-600">
                {imprint.lastUpdated}
              </p>
            </header>

            {/* Provider Information - § 5 DDG */}
            <section className="mt-10" aria-labelledby="provider-heading">
              <h2
                id="provider-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.provider.heading}
              </h2>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-[#3a2018]">
                  {sections.provider.subheading}
                </h3>
                <address
                  className="mt-3 not-italic text-base md:text-lg text-[#3a2018] space-y-1"
                  itemScope
                  itemType="https://schema.org/Person"
                  itemProp="author"
                >
                  <p className="font-semibold text-[#180a04]" itemProp="name">
                    {sections.provider.content.name}
                  </p>
                  <p itemProp="jobTitle">
                    {sections.provider.content.profession}
                  </p>
                  <p itemProp="streetAddress">
                    {sections.provider.content.street}
                  </p>
                  <p>
                    <span itemProp="postalCode addressLocality">
                      {sections.provider.content.city}
                    </span>
                  </p>
                  <p itemProp="addressCountry">
                    {sections.provider.content.country}
                  </p>
                </address>
              </div>
            </section>

            {/* Contact */}
            <section className="mt-10" aria-labelledby="contact-heading">
              <h2
                id="contact-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.contact.heading}
              </h2>
              <ul className="mt-4 space-y-3 text-base md:text-lg text-[#3a2018]">
                <li className="flex items-center gap-2">
                  <span className="font-medium min-w-20">
                    {sections.contact.phone.label}:
                  </span>
                  <a
                    href={`tel:${sections.contact.phone.value.replace(/\s/g, "")}`}
                    className="hover:text-[#c58d12] transition underline-offset-2 hover:underline"
                    itemProp="telephone"
                  >
                    {sections.contact.phone.value}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium min-w-20">
                    {sections.contact.email.label}:
                  </span>
                  <a
                    href={`mailto:${sections.contact.email.value}`}
                    className="hover:text-[#c58d12] transition underline-offset-2 hover:underline"
                    itemProp="email"
                  >
                    {sections.contact.email.value}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium min-w-20">
                    {sections.contact.website.label}:
                  </span>
                  <a
                    href={`https://${sections.contact.website.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#c58d12] transition underline-offset-2 hover:underline"
                    itemProp="url"
                  >
                    {sections.contact.website.value}
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-sm text-neutral-600">
                {sections.contact.availability}
              </p>
            </section>

            {/* Tax Information */}
            <section className="mt-10" aria-labelledby="tax-heading">
              <h2
                id="tax-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.tax.heading}
              </h2>
              <dl className="mt-4 space-y-4 text-base md:text-lg text-[#3a2018]">
                <div>
                  <dt className="font-medium">{sections.tax.vatId.label}</dt>
                  <dd className="mt-1">
                    <span className="font-semibold text-[#180a04]">
                      {sections.tax.vatId.value}
                    </span>
                    <p className="text-sm text-neutral-600 mt-1">
                      {sections.tax.vatId.note}
                    </p>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">
                    {sections.tax.taxNumber.label}
                  </dt>
                  <dd className="mt-1">
                    <span className="font-semibold text-[#180a04]">
                      {sections.tax.taxNumber.value}
                    </span>
                    <span className="text-neutral-600">
                      {" "}
                      ({sections.tax.taxNumber.office})
                    </span>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Professional Information */}
            <section className="mt-10" aria-labelledby="registration-heading">
              <h2
                id="registration-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.registration.heading}
              </h2>
              <dl className="mt-4 space-y-4 text-base md:text-lg text-[#3a2018]">
                <div>
                  <dt className="font-medium">
                    {sections.registration.activity.label}
                  </dt>
                  <dd className="mt-1">
                    {sections.registration.activity.value}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">
                    {sections.registration.authority.label}
                  </dt>
                  <dd className="mt-1 text-neutral-600">
                    {sections.registration.authority.value}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Professional Liability Insurance */}
            <section className="mt-10" aria-labelledby="insurance-heading">
              <h2
                id="insurance-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.insurance.heading}
              </h2>
              <dl className="mt-4 space-y-3 text-base md:text-lg text-[#3a2018]">
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="font-medium">
                    {sections.insurance.provider.label}:
                  </dt>
                  <dd>{sections.insurance.provider.value}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="font-medium">
                    {sections.insurance.address.label}:
                  </dt>
                  <dd>{sections.insurance.address.value}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="font-medium">
                    {sections.insurance.coverage.label}:
                  </dt>
                  <dd>{sections.insurance.coverage.value}</dd>
                </div>
              </dl>
            </section>

            {/* Responsible for Content */}
            <section className="mt-10" aria-labelledby="responsible-heading">
              <h2
                id="responsible-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.responsible.heading}
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                {sections.responsible.note}
              </p>
              <address className="mt-3 not-italic text-base md:text-lg text-[#3a2018]">
                <p className="font-semibold text-[#180a04]">
                  {sections.responsible.name}
                </p>
                <p>{sections.responsible.address}</p>
              </address>
            </section>

            {/* EU Dispute Resolution */}
            <section className="mt-10" aria-labelledby="dispute-heading">
              <h2
                id="dispute-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.dispute.heading}
              </h2>

              {/* ODR Platform Card */}
              <div className="mt-6 relative overflow-hidden rounded-2xl border border-neutral-200 bg-linear-to-br from-white to-neutral-50 p-6 md:p-8">
                <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-blue-500/5 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-[#c58d12]/5 to-transparent rounded-tr-full" />

                <div className="relative z-10">
                  {/* Header with EU Icon */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 shrink-0">
                      <svg
                        className="w-7 h-7 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#180a04]">
                        {language === "de"
                          ? "Online-Streitbeilegung (OS)"
                          : language === "tr"
                            ? "Çevrimiçi Uyuşmazlık Çözümü (ODR)"
                            : "Online Dispute Resolution (ODR)"}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        {sections.dispute.intro}
                      </p>
                    </div>
                  </div>

                  {/* ODR Link Button */}
                  <a
                    href={sections.dispute.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-5 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                    <span className="font-medium">
                      ec.europa.eu/consumers/odr
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </a>

                  {/* Email Note */}
                  <p className="mt-4 text-sm text-neutral-500 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    {sections.dispute.note}
                  </p>
                </div>
              </div>

              {/* Participation Notice */}
              <div className="mt-5 relative overflow-hidden rounded-2xl border-l-4 border-l-amber-500 border border-amber-200/50 bg-linear-to-r from-amber-50 to-orange-50/50 p-5 md:p-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-amber-400/10 to-transparent rounded-bl-full" />
                <div className="relative z-10 flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 shrink-0">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">
                      {language === "de"
                        ? "Hinweis zur Verbraucherschlichtung"
                        : language === "tr"
                          ? "Tüketici Tahkimi Bildirimi"
                          : "Consumer Arbitration Notice"}
                    </h4>
                    <p className="text-sm md:text-base text-amber-800/90 leading-relaxed">
                      {sections.dispute.participation}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mt-10" aria-labelledby="liability-heading">
              <h2
                id="liability-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.liability.heading}
              </h2>

              {/* Liability for Content */}
              <div className="mt-6">
                <h3 className="text-xl font-medium text-[#180a04]">
                  {sections.liability.content.heading}
                </h3>
                <p className="mt-3 text-base md:text-lg text-[#3a2018] leading-relaxed">
                  {sections.liability.content.text}
                </p>
              </div>

              {/* Liability for Links */}
              <div className="mt-6">
                <h3 className="text-xl font-medium text-[#180a04]">
                  {sections.liability.links.heading}
                </h3>
                <p className="mt-3 text-base md:text-lg text-[#3a2018] leading-relaxed">
                  {sections.liability.links.text}
                </p>
              </div>

              {/* Copyright */}
              <div className="mt-6">
                <h3 className="text-xl font-medium text-[#180a04]">
                  {sections.liability.copyright.heading}
                </h3>
                <p className="mt-3 text-base md:text-lg text-[#3a2018] leading-relaxed">
                  {sections.liability.copyright.text}
                </p>
              </div>
            </section>

            {/* Image Credits */}
            <section className="mt-10" aria-labelledby="image-credits-heading">
              <h2
                id="image-credits-heading"
                className="text-2xl font-semibold text-[#180a04] md:text-3xl"
              >
                {sections.imageCredits.heading}
              </h2>
              <p className="mt-4 text-base md:text-lg text-[#3a2018]">
                {sections.imageCredits.intro}
              </p>
              <ul className="mt-4 space-y-2 list-disc list-inside text-base md:text-lg text-[#3a2018]">
                {sections.imageCredits.credits.map((credit, index) => (
                  <li key={`image-credit-${index}`}>{credit}</li>
                ))}
              </ul>
            </section>

            {/* Related Links */}
            <nav
              className="mt-16 pt-10 border-t border-neutral-200"
              aria-label="Related legal pages"
            >
              <h2 className="text-xl font-semibold text-[#180a04] mb-6">
                {language === "de"
                  ? "Weitere rechtliche Informationen"
                  : language === "tr"
                    ? "Diğer yasal bilgiler"
                    : "More legal information"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Privacy Policy Card */}
                <Link
                  href="/privacy"
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-linear-to-br from-white to-neutral-50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#c58d12]/10 hover:border-[#c58d12]/30 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#c58d12]/5 to-transparent rounded-bl-full transition-all duration-300 group-hover:w-40 group-hover:h-40" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-[#c58d12]/10 to-[#c58d12]/5 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:from-[#c58d12]/20 group-hover:to-[#c58d12]/10">
                      <svg
                        className="w-6 h-6 text-[#c58d12]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#180a04] mb-2 transition-colors duration-300 group-hover:text-[#c58d12]">
                      {language === "de"
                        ? "Datenschutzerklärung"
                        : language === "tr"
                          ? "Gizlilik Politikası"
                          : "Privacy Policy"}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {language === "de"
                        ? "Erfahren Sie, wie wir Ihre Daten schützen und verarbeiten."
                        : language === "tr"
                          ? "Verilerinizi nasıl koruduğumuzu ve işlediğimizi öğrenin."
                          : "Learn how we protect and process your data."}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#c58d12] transition-all duration-300 group-hover:gap-3">
                      {language === "de"
                        ? "Mehr erfahren"
                        : language === "tr"
                          ? "Daha fazla"
                          : "Learn more"}
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Terms & Conditions Card */}
                <Link
                  href="/terms"
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-linear-to-br from-white to-neutral-50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#c58d12]/10 hover:border-[#c58d12]/30 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#c58d12]/5 to-transparent rounded-bl-full transition-all duration-300 group-hover:w-40 group-hover:h-40" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-[#c58d12]/10 to-[#c58d12]/5 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:from-[#c58d12]/20 group-hover:to-[#c58d12]/10">
                      <svg
                        className="w-6 h-6 text-[#c58d12]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#180a04] mb-2 transition-colors duration-300 group-hover:text-[#c58d12]">
                      {language === "de"
                        ? "Allgemeine Geschäftsbedingungen"
                        : language === "tr"
                          ? "Hizmet Şartları"
                          : "Terms & Conditions"}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {language === "de"
                        ? "Unsere Geschäftsbedingungen und Servicerichtlinien."
                        : language === "tr"
                          ? "Ticari koşullarımız ve hizmet politikalarımız."
                          : "Our business terms and service policies."}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#c58d12] transition-all duration-300 group-hover:gap-3">
                      {language === "de"
                        ? "Mehr erfahren"
                        : language === "tr"
                          ? "Daha fazla"
                          : "Learn more"}
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            </nav>
          </article>
        </NoiseBackground>
      </main>
    </>
  );
}
