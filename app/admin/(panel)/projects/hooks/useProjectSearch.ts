"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Project, ProjectSortOption } from "../types";

export function useProjectSearch(projects: Project[] = []) {
  const [searchQuery, setSearchQuery] = useState("");
  const [liveResults, setLiveResults] = useState<Project[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState<ProjectSortOption>("none");
  const debounceRef = useRef<number | null>(null);

  const filteredProjects = useMemo(() => {
    let data = [...projects];

    if (searchQuery.trim()) {
      const needle = searchQuery.toLowerCase();
      data = data.filter((project) =>
        project.title.toLowerCase().includes(needle),
      );
    }

    const compareDates = (first?: string, second?: string) => {
      const a = first ? new Date(first).getTime() : 0;
      const b = second ? new Date(second).getTime() : 0;
      return a - b;
    };

    switch (filter) {
      case "name_asc":
        data.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
        );
        break;
      case "name_desc":
        data.sort((a, b) =>
          b.title.localeCompare(a.title, undefined, { sensitivity: "base" }),
        );
        break;
      case "created_asc":
        data.sort((a, b) => compareDates(a.createdAt, b.createdAt));
        break;
      case "created_desc":
        data.sort((a, b) => compareDates(b.createdAt, a.createdAt));
        break;
      default:
        break;
    }

    return data;
  }, [projects, searchQuery, filter]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (debounceRef.current) window.clearTimeout(debounceRef.current);

      debounceRef.current = window.setTimeout(() => {
        const trimmed = value.trim();
        if (!trimmed) {
          setLiveResults([]);
          setShowDropdown(false);
          return;
        }
        const matches = filteredProjects.filter((project) =>
          project.title.toLowerCase().includes(trimmed.toLowerCase()),
        );
        setLiveResults(matches.slice(0, 6));
        setShowDropdown(matches.length > 0);
      }, 250);
    },
    [filteredProjects],
  );

  const handleSearchSubmit = useCallback(
    (event: Event | { preventDefault?: () => void }) => {
      event?.preventDefault?.();
      setSearchQuery((v) => v.trim());
    },
    [],
  );

  const handleSuggestionSelect = useCallback((project: Project) => {
    setSearchQuery(project.title);
    setShowDropdown(false);
  }, []);

  const handleDropdownVisibility = useCallback(
    (visible: boolean) => {
      if (visible && liveResults.length === 0) return;
      setShowDropdown(visible);
    },
    [liveResults.length],
  );

  return {
    searchQuery,
    setSearchQuery,
    liveResults,
    showDropdown,
    handleSearchChange,
    handleSearchSubmit,
    handleSuggestionSelect,
    handleDropdownVisibility,
    filteredProjects,
    filter,
    setFilter,
  } as const;
}

export default useProjectSearch;
