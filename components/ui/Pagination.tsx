import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  getPageNumbers: () => Array<number | "…">;
  getCurrentRange: () => { start: number; end: number; total: number };
  theme?: "dark" | "light" | "admin";
  showInfo?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onNextPage,
  onPrevPage,
  getPageNumbers,
  getCurrentRange,
  theme = "dark",
  showInfo = true,
  size = "md",
  className = "",
}) => {
  // Tema stilleri
  const themeStyles = {
    dark: {
      container:
        "backdrop-blur bg-white/5 border border-white/10 rounded-2xl shadow-lg",
      button: {
        base: "rounded-xl flex items-center justify-center border transition",
        disabled: "border-white/10 text-white/40 cursor-not-allowed",
        enabled: "border-white/20 text-white hover:bg-white/10",
        active: "bg-white text-black border-white",
      },
      info: "text-white/70",
      ellipsis: "text-white/60",
    },
    light: {
      container: "bg-white/90 border border-gray-200 rounded-2xl shadow-lg",
      button: {
        base: "rounded-xl flex items-center justify-center border transition",
        disabled: "border-gray-200 text-gray-400 cursor-not-allowed",
        enabled: "border-gray-300 text-gray-700 hover:bg-gray-50",
        active: "bg-gray-900 text-white border-gray-900",
      },
      info: "text-gray-600",
      ellipsis: "text-gray-400",
    },
    admin: {
      container:
        "backdrop-blur-lg bg-gradient-to-br from-[#eeede9]/95 to-[#eeede9]/90 border border-[#131313]/15 rounded-2xl shadow-2xl",
      button: {
        base: "rounded-xl flex items-center justify-center border transition-all duration-300 hover:scale-105",
        disabled:
          "border-[#131313]/20 text-[#131313]/40 cursor-not-allowed hover:scale-100",
        enabled:
          "border-[#131313]/30 text-[#131313] hover:bg-gradient-to-br hover:from-[#131313]/10 hover:to-[#131313]/5 hover:border-[#131313]/60 hover:shadow-lg",
        active:
          "bg-gradient-to-br from-[#131313] to-[#131313]/90 text-white border-[#131313] shadow-xl hover:from-[#131313]/90 hover:to-[#131313]/80",
      },
      info: "text-gray-600 font-medium",
      ellipsis: "text-[#131313]/60 font-medium",
    },
  };

  // Boyut stilleri
  const sizeStyles = {
    sm: {
      button: "h-8 w-8 text-sm",
      gap: "gap-1",
      padding: "px-2 py-2",
      info: "text-xs",
    },
    md: {
      button: "h-10 w-10 sm:h-11 sm:w-11",
      gap: "gap-1 sm:gap-2",
      padding: "px-2 py-2 sm:px-3 sm:py-3",
      info: "text-sm",
    },
    lg: {
      button: "h-12 w-12",
      gap: "gap-2",
      padding: "px-4 py-4",
      info: "text-base",
    },
  };

  const currentTheme = themeStyles[theme];
  const currentSize = sizeStyles[size];
  const range = getCurrentRange();

  // Sayfa sayısı 1'den azsa pagination gösterme
  if (totalPages <= 1) {
    return null;
  }

  // SVG ikonları
  const ChevronLeftIcon = () => (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav className={`mt-6 select-none ${className}`} aria-label="Pagination">
      <div className="w-full flex items-center justify-center">
        <div className={`${currentTheme.container} ${currentSize.padding}`}>
          <div className={`flex items-center ${currentSize.gap}`}>
            {/* Previous Button */}
            <button
              onClick={onPrevPage}
              disabled={!hasPrevPage}
              className={`${currentSize.button} ${currentTheme.button.base} ${
                !hasPrevPage
                  ? currentTheme.button.disabled
                  : currentTheme.button.enabled
              }`}
              aria-label="Önceki Sayfa"
            >
              <ChevronLeftIcon />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((item, idx) => {
              if (item === "…") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className={`${currentSize.button} ${currentTheme.button.base} ${currentTheme.ellipsis} flex items-center justify-center`}
                  >
                    …
                  </span>
                );
              }

              const page = item as number;
              const isActive = page === currentPage;

              return (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(page)}
                  className={`${currentSize.button} ${
                    currentTheme.button.base
                  } ${
                    isActive
                      ? currentTheme.button.active
                      : currentTheme.button.enabled
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              className={`${currentSize.button} ${currentTheme.button.base} ${
                !hasNextPage
                  ? currentTheme.button.disabled
                  : currentTheme.button.enabled
              }`}
              aria-label="Sonraki Sayfa"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Bilgi Metni */}
      {showInfo && (
        <p
          className={`mt-3 text-center ${currentTheme.info} ${currentSize.info}`}
        >
          Page {currentPage} / {totalPages} ({range.start}-{range.end} /{" "}
          {range.total})
        </p>
      )}
    </nav>
  );
};

export default Pagination;
