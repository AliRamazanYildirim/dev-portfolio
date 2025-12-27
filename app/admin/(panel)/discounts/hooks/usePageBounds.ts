import { useEffect } from "react";

export function usePageBounds(
  itemsLength: number,
  perPage: number,
  page: number,
  setPage: (p: number) => void,
) {
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(itemsLength / perPage));
    if (page > totalPages) setPage(totalPages);
  }, [itemsLength, perPage, page, setPage]);
}
