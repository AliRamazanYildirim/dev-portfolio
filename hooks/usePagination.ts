import { useState, useMemo, useCallback } from "react";

export interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
  maxPageNumbers?: number; // Ellipsis için maksimum gösterilecek sayfa sayısı
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  getPageNumbers: () => Array<number | "…">;
  paginatedData: <T>(data: T[]) => T[];
  getCurrentRange: () => { start: number; end: number; total: number };
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1,
  maxPageNumbers = 7,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Toplam sayfa sayısını hesapla
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Sayfa değiştiğinde sınırları kontrol et
  const goToPage = useCallback(
    (page: number) => {
      const targetPage = Math.min(Math.max(1, page), totalPages);
      setCurrentPage(targetPage);
    },
    [totalPages]
  );

  // Sonraki sayfa
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  // Önceki sayfa
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Mevcut verinin başlangıç ve bitiş indekslerini hesapla
  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  // Önceki/sonraki sayfa kontrolü
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Ellipsis ile sayfa numaralarını hesapla (Projects sayfasından)
  const getPageNumbers = useCallback((): Array<number | "…"> => {
    if (totalPages <= maxPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: Array<number | "…"> = [1];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    if (left > 2) items.push("…");
    for (let p = left; p <= right; p++) items.push(p);
    if (right < totalPages - 1) items.push("…");
    if (totalPages > 1) items.push(totalPages);

    return items;
  }, [currentPage, totalPages, maxPageNumbers]);

  // Veriyi sayfalama
  const paginatedData = useCallback(
    <T>(data: T[]): T[] => {
      return data.slice(startIndex, endIndex);
    },
    [startIndex, endIndex]
  );

  // Mevcut aralığı al
  const getCurrentRange = useCallback(() => {
    return {
      start: totalItems === 0 ? 0 : startIndex + 1,
      end: endIndex,
      total: totalItems,
    };
  }, [startIndex, endIndex, totalItems]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    getPageNumbers,
    paginatedData,
    getCurrentRange,
  };
};
