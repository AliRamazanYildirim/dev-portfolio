"use client";

import { useTranslation } from "@/hooks/useTranslation";
import NoiseBackground from "@/components/NoiseBackground";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SolutionsPage() {
  const { dictionary: translations } = useTranslation();
  const solutions = (translations as any).nav.solutions.items;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <main className="min-h-screen">
      <NoiseBackground mode="light" intensity={0.1}>
        <div className="pt-32 pb-20">
          {/* Page Header */}
          <motion.div
            className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tailored approaches for every challenge your business faces
            </p>
          </motion.div>

          {/* Solutions Grid */}
          <motion.div
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.map((solution: any, index: number) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link href={solution.href}>
                    <div className="h-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-8 hover:border-amber-500/50 dark:hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg">
                      {/* Icon */}
                      {solution.icon && (
                        <div className="mb-6 h-16 w-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img
                            src={solution.icon}
                            alt={solution.alt}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {solution.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {solution.description}
                      </p>

                      {/* Arrow */}
                      <div className="inline-flex items-center text-amber-600 dark:text-amber-400 font-semibold group-hover:gap-2 transition-all duration-300">
                        <span>Learn more</span>
                        <svg
                          className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
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
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 text-center border border-gray-700">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Don't See Your Solution?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Every business is unique. Let's discuss your specific needs and
                find the perfect approach.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Schedule a Discovery Call
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
          </motion.div>
        </div>
      </NoiseBackground>
    </main>
  );
}
