"use client";

import { useTranslation } from "@/hooks/useTranslation";
import NoiseBackground from "@/components/NoiseBackground";
import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionFeatures from "@/components/solutions/SolutionFeatures";
import SolutionTestimonial from "@/components/solutions/SolutionTestimonial";
import SolutionPricing from "@/components/solutions/SolutionPricing";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SolutionDetailPage() {
  const { dictionary: translations } = useTranslation();
  const params = useParams();
  const slug = params.slug as string;

  // Get solution data based on slug
  const solutionData = (translations as any)?.solutions?.[slug];

  if (!solutionData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <NoiseBackground mode="light" intensity={0.1}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Solution not found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The solution you're looking for doesn't exist.
            </p>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Back to Solutions
            </Link>
          </div>
        </NoiseBackground>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <NoiseBackground mode="light" intensity={0.1}>
        {/* Hero Section */}
        <SolutionHero
          title={solutionData.subtitle}
          headline={solutionData.hero.headline}
          description={solutionData.hero.description}
          cta={solutionData.hero.cta}
        />

        {/* Features Section */}
        {solutionData.features && (
          <SolutionFeatures features={solutionData.features} />
        )}

        {/* Testimonial Section */}
        {solutionData.testimonial && (
          <NoiseBackground mode="dark" intensity={0.08}>
            <SolutionTestimonial testimonial={solutionData.testimonial} />
          </NoiseBackground>
        )}

        {/* Pricing Section */}
        {solutionData.pricing && (
          <SolutionPricing tiers={solutionData.pricing} />
        )}

        {/* CTA Section */}
        <motion.section
          className="py-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Ready to Get Started?
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                Let's discuss how this solution can transform your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Start Your Project
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300"
                >
                  Explore Other Solutions
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </NoiseBackground>
    </main>
  );
}
