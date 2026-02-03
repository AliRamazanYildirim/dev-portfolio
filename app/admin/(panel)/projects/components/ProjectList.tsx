"use client";

import Image from "next/image";
import NoiseBackground from "@/components/NoiseBackground";
import Pagination from "@/components/ui/Pagination";
import type { Project } from "../types";

interface PaginationControls {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  getPageNumbers: () => Array<number | "…">;
  getCurrentRange: () => { start: number; end: number; total: number };
}

interface ProjectListProps {
  loading: boolean;
  filteredProjects: Project[];
  paginatedProjects: Project[];
  pagination: PaginationControls;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  formatCreatedDate: (iso?: string) => string;
  getDescriptionText: (desc: Project["description"]) => string;
}

export function ProjectList({
  loading,
  filteredProjects,
  paginatedProjects,
  pagination,
  onEditProject,
  onDeleteProject,
  formatCreatedDate,
  getDescriptionText,
}: ProjectListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-24">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white" />
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24">
        <div className="bg-[#eeede9] rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-8 sm:p-12 max-w-sm sm:max-w-md mx-auto">
          <svg
            className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-[#131313]/50 mb-4 sm:mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0122 34c4.09 0 7.691 2.462 9.287 6M6 16a6 6 0 0112 0v3.586l.707.707c.63.63.293 1.707-.707 1.707H6z"
            />
          </svg>
          <h3 className="text-lg sm:text-xl font-medium text-[#131313] mb-2 sm:mb-3">
            No projects match your filters
          </h3>
          <p className="text-sm sm:text-base text-[#131313]/70">
            Try adjusting your search or clearing the filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8">
      {paginatedProjects.map((project) => (
        <div key={project.id} className="group">
          <div className="rounded-xl sm:rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
            <NoiseBackground
              mode="light"
              intensity={0.05}
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative"
            >
              <div className="absolute top-4 right-4 font-semibold text-xs sm:text-sm text-[#131313]/80 bg-white/80 border border-[#131313]/20 rounded-full px-3 py-1 shadow-sm">
                {formatCreatedDate(project.createdAt)}
              </div>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 mt-6 sm:mt-0">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#131313] wrap-break-word">
                      {project.title}
                    </h3>
                    <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
                      {project.category && (
                        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-green-600 text-white">
                          {project.category}
                        </span>
                      )}

                      {project.isFeatured && (
                        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-[#c9184a] text-white">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-[#131313]/80 mb-4 sm:mb-6 leading-relaxed">
                    {typeof project.shortDescription === "string"
                      ? project.shortDescription
                      : getDescriptionText(project.shortDescription)}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {project.techStack?.map((tech, index) => (
                      <span
                        key={`${tech}-${index}`}
                        className="inline-flex items-center px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-amber-500/20 text-[#131313] border border-[#131313]/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.gallery?.length > 0 && (
                    <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
                      {project.gallery.slice(0, 3).map((img, index) => (
                        <div
                          key={`${img.url}-${index}`}
                          className="relative shrink-0"
                        >
                          <Image
                            src={img.url}
                            alt={`${project.title} — galeri görseli ${
                              index + 1
                            }`}
                            width={60}
                            height={40}
                            className="w-12 h-8 sm:w-15 sm:h-10 object-cover rounded-lg border border-[#131313]/20"
                          />
                        </div>
                      ))}
                      {project.gallery.length > 3 && (
                        <div className="w-12 h-8 sm:w-15 sm:h-10 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-black">
                            +{project.gallery.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-row gap-2 sm:gap-3 lg:ml-6 w-full lg:w-auto lg:justify-end lg:items-end lg:self-end mt-4 lg:mt-0">
                  <button
                    onClick={() => onEditProject(project)}
                    className="inline-flex items-center justify-center flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg sm:rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 text-xs sm:text-base"
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="inline-flex items-center justify-center flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg sm:rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 text-xs sm:text-base"
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </NoiseBackground>
          </div>
        </div>
      ))}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
        onPageChange={pagination.onPageChange}
        onNextPage={pagination.onNextPage}
        onPrevPage={pagination.onPrevPage}
        getPageNumbers={pagination.getPageNumbers}
        getCurrentRange={pagination.getCurrentRange}
        theme="admin"
        showInfo
        size="md"
        className="mt-12"
      />
    </div>
  );
}
