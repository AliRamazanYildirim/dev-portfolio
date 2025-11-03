"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RatingCard from "./RatingCard";
import type { GoogleRating } from "@/constants/googleRatings";

interface ReviewsCarouselProps {
  reviews: GoogleRating[];
  reviewsLabel: string;
  verifiedLabel: string;
}

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({
  reviews,
  reviewsLabel,
  verifiedLabel,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isClient, setIsClient] = useState(false);

  // Client-side mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Responsive logic
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3); // Desktop
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2); // Tablet
      } else {
        setItemsPerPage(1); // Mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  // Total slides hesapla
  const totalSlides = Math.max(1, Math.ceil(reviews.length / itemsPerPage));

  // Tarihe göre sırala (yeniden eskiye)
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.verificationDate).getTime();
    const dateB = new Date(b.verificationDate).getTime();
    return dateB - dateA; // Yeniden eskiye sırala
  });

  // Visible reviews belirle
  const visibleReviews = sortedReviews.slice(
    currentSlide * itemsPerPage,
    (currentSlide + 1) * itemsPerPage
  );

  // Auto-rotate logic
  useEffect(() => {
    if (!isAutoPlaying || !isClient) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 10000); // 10 saniyede ilerle

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, isClient]);

  // Navigation handlers
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    // Auto-play'i 1 saniye sonra devam ettir
    setTimeout(() => setIsAutoPlaying(true), 1000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    // Auto-play'i 1 saniye sonra devam ettir
    setTimeout(() => setIsAutoPlaying(true), 1000);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    // Auto-play'i 1 saniye sonra devam ettir
    setTimeout(() => setIsAutoPlaying(true), 1000);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Grid - Responsive layout */}
      <div
        className={`grid gap-6 md:gap-8 ${
          itemsPerPage === 3
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : itemsPerPage === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        <AnimatePresence>
          {visibleReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <RatingCard
                rating={review}
                index={index}
                verifiedLabel={verifiedLabel}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 md:gap-8 mt-10 md:mt-14">
        {/* Prev Button - Premium Style */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={handlePrev}
          className="group relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden"
          aria-label="Previous slide"
        >
          {/* Gradient Background - Golden Tones */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 opacity-100 group-hover:opacity-110 transition-opacity duration-300" />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
            animate={{
              boxShadow: [
                "0 0 20px rgba(234, 179, 8, 0.5)",
                "0 0 30px rgba(217, 119, 6, 0.5)",
                "0 0 20px rgba(251, 146, 60, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Button content */}
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-md group-hover:drop-shadow-lg transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </motion.button>

        {/* Pagination Dots - Enhanced */}
        <div className="flex items-center gap-3 md:gap-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`rounded-full transition-all duration-300 backdrop-blur-sm ${
                i === currentSlide
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 w-10 h-3 md:w-12 md:h-3 shadow-lg shadow-amber-500/50"
                  : "bg-white/20 w-2.5 h-2.5 md:w-3 md:h-3 hover:bg-white/40 hover:w-4 md:hover:w-5"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Next Button - Premium Style */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleNext}
          className="group relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden"
          aria-label="Next slide"
        >
          {/* Gradient Background - Golden Tones */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 opacity-100 group-hover:opacity-110 transition-opacity duration-300" />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
            animate={{
              boxShadow: [
                "0 0 20px rgba(251, 146, 60, 0.5)",
                "0 0 30px rgba(217, 119, 6, 0.5)",
                "0 0 20px rgba(234, 179, 8, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Button content */}
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-md group-hover:drop-shadow-lg transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </motion.button>
      </div>

      {/* Slide Counter (optional) */}
      <div className="text-center mt-6 text-white/50 text-sm">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default ReviewsCarousel;
