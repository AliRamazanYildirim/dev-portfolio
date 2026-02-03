"use client";

import { FormEvent } from "react";
import { RefreshCcw, Search, Filter } from "lucide-react";
import type { Project, ProjectSortOption } from "../types";

interface ProjectsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  filter: ProjectSortOption;
  onFilterChange: (value: ProjectSortOption) => void;
  onRefresh: () => void;
  loading: boolean;
  liveResults: Project[];
  showDropdown: boolean;
  onSuggestionSelect: (project: Project) => void;
  onDropdownVisibilityChange: (visible: boolean) => void;
  statsText: string;
  totalLabel: string;
}

export function ProjectsToolbar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  filter,
  onFilterChange,
  onRefresh,
  loading,
  liveResults,
  showDropdown,
  onSuggestionSelect,
  onDropdownVisibilityChange,
  statsText,
  totalLabel,
}: ProjectsToolbarProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-0">
            {totalLabel}
          </h2>
          <p className="text-white/70 mt-2">{statsText}</p>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <form
            onSubmit={onSearchSubmit}
            className="flex flex-col w-full gap-2"
          >
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-black/50" />
              <input
                type="search"
                placeholder="Search project name..."
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full bg-white/90 text-black pl-8 sm:pl-9 pr-3 py-1.5 rounded-md text-sm focus:outline-none"
                onFocus={() => {
                  if (liveResults.length > 0) onDropdownVisibilityChange(true);
                }}
                onBlur={() =>
                  setTimeout(() => onDropdownVisibilityChange(false), 150)
                }
              />

              {showDropdown && liveResults.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto text-sm text-black">
                  {liveResults.map((project) => (
                    <li
                      key={project.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => onSuggestionSelect(project)}
                    >
                      <div className="font-semibold text-gray-900">
                        {project.title}
                      </div>
                      {project.category && (
                        <div className="text-gray-600">{project.category}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-row gap-2 w-full">
              <button
                type="submit"
                className="flex-1 landscape:flex-none sm:flex-1! flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-[#131313] px-3 py-1.5 rounded-md text-sm font-semibold"
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Search</span>
              </button>
              {/* Mobile only (portrait + landscape) */}
              <div className="relative flex-1 landscape:flex-none sm:hidden landscape:block!">
                <Filter className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/70" />
                <select
                  value={filter}
                  onChange={(event) =>
                    onFilterChange(event.target.value as ProjectSortOption)
                  }
                  className="w-full appearance-none cursor-pointer bg-[#131313] text-white font-semibold pl-8 pr-6 py-1.5 rounded-lg text-sm shadow-lg"
                >
                  <option value="none">Filter</option>
                  <option value="name_asc">Name: A → Z</option>
                  <option value="name_desc">Name: Z → A</option>
                  <option value="created_asc">Created: Old → New</option>
                  <option value="created_desc">Created: New → Old</option>
                </select>
              </div>
              {/* Desktop only */}
              <div className="relative flex-1 hidden sm:block landscape:hidden!">
                <Filter className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <select
                  value={filter}
                  onChange={(event) =>
                    onFilterChange(event.target.value as ProjectSortOption)
                  }
                  className="w-full appearance-none cursor-pointer bg-[#131313] text-white font-semibold pl-9 pr-6 py-1.5 rounded-lg text-sm shadow-lg"
                >
                  <option value="none">Filter / Sort</option>
                  <option value="name_asc">Name: A → Z</option>
                  <option value="name_desc">Name: Z → A</option>
                  <option value="created_asc">Created: Old → New</option>
                  <option value="created_desc">Created: New → Old</option>
                </select>
              </div>
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="flex-1 landscape:flex-none sm:flex-1! flex items-center justify-center gap-1.5 sm:gap-2 bg-white text-[#131313] px-3 py-1.5 rounded-lg font-semibold shadow hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <RefreshCcw
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#131313] ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
