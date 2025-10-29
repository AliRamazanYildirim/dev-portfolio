"use client";

import { motion } from "framer-motion";

interface TestimonialData {
  quote: string;
  author: string;
  role: string;
  metric: string;
}

interface SolutionTestimonialProps {
  testimonial: TestimonialData;
}

export default function SolutionTestimonial({
  testimonial,
}: SolutionTestimonialProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Quote Icon */}
          <motion.div variants={itemVariants} className="mb-8">
            <svg
              className="w-16 h-16 text-amber-500/30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-6 0-6 5-6 10.972C.002 15.555.994 21 3 21z"></path>
            </svg>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold mb-8 leading-relaxed"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              "{testimonial.quote}"
            </span>
          </motion.blockquote>

          {/* Author info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="mb-4 sm:mb-0">
              <p className="font-semibold text-gray-900 dark:text-white">
                {testimonial.author}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {testimonial.role}
              </p>
            </div>

            {/* Metric */}
            <motion.div
              variants={itemVariants}
              className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 dark:border-amber-500/30"
            >
              <p className="font-bold text-amber-600 dark:text-amber-400">
                {testimonial.metric}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
