"use client";

import { useMemo } from "react";
import {
  calculateTotalRecovered,
  computeStageGroups,
  buildPagination,
} from "../utils";
import {
  mergeAndSortInvoices,
  filterInvoices,
  paginate,
} from "../domain/invoices";

export function useTotalRecovered(sent: any[]) {
  return useMemo(() => calculateTotalRecovered(sent), [sent]);
}

export function useAllInvoices(data: { pending: any[]; sent: any[] }) {
  return useMemo(() => mergeAndSortInvoices(data), [data]);
}

export function useFilteredInvoices(
  allInvoices: any[],
  statusFilter: string,
  searchTerm: string,
) {
  return useMemo(
    () => filterInvoices(allInvoices, statusFilter as any, searchTerm),
    [allInvoices, statusFilter, searchTerm],
  );
}

export function usePaginatedRecords(
  filteredInvoices: any[],
  recordsPage: number,
  recordsPerPage: number,
  setRecordsPage: (n: number) => void,
) {
  const paginatedRecords = useMemo(
    () => paginate(filteredInvoices, recordsPage, recordsPerPage),
    [filteredInvoices, recordsPage, recordsPerPage],
  );

  const recordPagination = useMemo(
    () =>
      buildPagination(
        filteredInvoices.length,
        recordsPerPage,
        recordsPage,
        setRecordsPage,
      ),
    [filteredInvoices.length, recordsPerPage, recordsPage, setRecordsPage],
  );

  return { paginatedRecords, recordPagination };
}

export function useStageGroups(allInvoices: any[]) {
  return useMemo(() => computeStageGroups(allInvoices), [allInvoices]);
}

export function usePaginatedStageGroups(
  stageGroups: any[],
  stagesPage: number,
  stagesPerPage: number,
  setStagesPage: (n: number) => void,
) {
  const paginatedStageGroups = useMemo(
    () => paginate(stageGroups, stagesPage, stagesPerPage),
    [stageGroups, stagesPage, stagesPerPage],
  );

  const stagePagination = useMemo(
    () =>
      buildPagination(
        stageGroups.length,
        stagesPerPage,
        stagesPage,
        setStagesPage,
      ),
    [stageGroups.length, stagesPerPage, stagesPage, setStagesPage],
  );

  return { paginatedStageGroups, stagePagination };
}
