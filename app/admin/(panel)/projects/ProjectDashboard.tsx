"use client";

import { FormEvent, useEffect, useRef } from "react";
import NoiseBackground from "@/components/NoiseBackground";
import useConfirmDelete from "./hooks/useConfirmDelete";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { usePagination } from "@/hooks/usePagination";
import { useAdminSidebar } from "@/hooks/useAdminSidebar";
import { INVOICE_CONSTANTS } from "@/constants/invoice";
import { useProjects } from "./hooks/useProjects";
import { useProjectForm } from "./hooks/useProjectForm";
import { useProjectSearch } from "./hooks/useProjectSearch";
import { ProjectsHero } from "./components/ProjectsHero";
import { ProjectsToolbar } from "./components/ProjectsToolbar";
import { ProjectList } from "./components/ProjectList";
import { ProjectFormModal } from "./components/ProjectFormModal";
import {
  formatCreatedDate,
  getDescriptionText,
  formatStatsText,
  formatTotalLabel,
} from "./lib/format";
import type { Project, ProjectSortOption } from "./types";

const ITEMS_PER_PAGE = 2;
const DEFAULT_DURATION: string = INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION[0];

export function ProjectDashboard() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();

  const { projects, loading, fetchProjects, deleteProject } = useProjects();

  const projectSearch = useProjectSearch(projects);
  const {
    searchQuery,
    liveResults,
    showDropdown,
    handleSearchChange,
    handleSearchSubmit,
    handleSuggestionSelect,
    handleDropdownVisibility,
    filteredProjects,
    filter,
    setFilter,
  } = projectSearch;

  const projectForm = useProjectForm({
    onSaved: async () => await fetchProjects(),
  });

  const { setOpen } = useAdminSidebar();

  const listTopRef = useRef<HTMLDivElement | null>(null);

  // `filteredProjects` is provided by `useProjectSearch` (centralized filtering + search)

  const pagination = usePagination({
    totalItems: filteredProjects.length,
    itemsPerPage: ITEMS_PER_PAGE,
    initialPage: 1,
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNextPage,
    hasPrevPage,
    getPageNumbers,
    getCurrentRange,
  } = pagination;

  useEffect(() => {
    goToPage(1);
  }, [searchQuery, filter, goToPage]);

  useEffect(() => {
    if (totalPages < 1) return;
    if (currentPage > totalPages) goToPage(totalPages);
  }, [filteredProjects.length, currentPage, totalPages, goToPage]);

  const paginatedProjects = paginatedData(filteredProjects);

  const handlePageChange = (page: number) => {
    goToPage(page);
    if (listTopRef.current)
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Sidebar state is handled by `useAdminSidebar` (see hooks/useAdminSidebar.ts)

  const resetForm = () => {
    projectForm.resetForm();
    setOpen(true);
  };

  const openForm = () => {
    setOpen(false);
    projectForm.openForm();
  };

  const confirmDelete = useConfirmDelete(deleteProject, {
    onSuccess: fetchProjects,
    messages: {
      success: "The project has been deleted.",
      loading: "Deleting project...",
      error: "Delete failed",
    },
  });

  const editProject = (project: Project) => {
    projectForm.openForEdit(project);
    setOpen(false);
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <NoiseBackground mode="dark" intensity={0.1}>
          <div className="relative z-10 flex items-center justify-center min-h-screen w-full h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
              <p className="text-white text-lg">Session is being verified...</p>
            </div>
          </div>
        </NoiseBackground>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const paginationControls = {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange: handlePageChange,
    onNextPage: () => handlePageChange(currentPage + 1),
    onPrevPage: () => handlePageChange(currentPage - 1),
    getPageNumbers,
    getCurrentRange,
  };

  const statsText = formatStatsText(
    filteredProjects.length,
    projects.length,
    getCurrentRange(),
  );

  const totalLabel = formatTotalLabel(filteredProjects.length, projects.length);

  return (
    <main className="relative flex justify-center items-center flex-col overflow-x-hidden mx-auto">
      <div className="w-full">
        <NoiseBackground mode="dark" intensity={0.1}>
          <ProjectsHero onCreateProject={openForm} />

          <div className="relative z-10 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:pt-0">
              <div ref={listTopRef}>
                <ProjectsToolbar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  onSearchSubmit={(e: FormEvent<HTMLFormElement>) =>
                    handleSearchSubmit(e)
                  }
                  filter={filter}
                  onFilterChange={setFilter}
                  onRefresh={fetchProjects}
                  loading={loading}
                  liveResults={liveResults}
                  showDropdown={showDropdown}
                  onSuggestionSelect={handleSuggestionSelect}
                  onDropdownVisibilityChange={handleDropdownVisibility}
                  statsText={statsText}
                  totalLabel={totalLabel}
                />
              </div>

              <ProjectList
                loading={loading}
                filteredProjects={filteredProjects}
                paginatedProjects={paginatedProjects}
                pagination={paginationControls}
                onEditProject={editProject}
                onDeleteProject={(id: string) => {
                  void confirmDelete(id);
                }}
                formatCreatedDate={formatCreatedDate}
                getDescriptionText={getDescriptionText}
              />
            </div>
          </div>
        </NoiseBackground>
      </div>

      <ProjectFormModal
        visible={projectForm.showForm}
        editingProject={Boolean(projectForm.editingProject)}
        values={{
          title: projectForm.title,
          shortDescription: projectForm.shortDescription,
          description: projectForm.description,
          descriptionDE: projectForm.descriptionDE,
          descriptionTR: projectForm.descriptionTR,
          techStack: projectForm.techStack,
          category: projectForm.category,
          duration: projectForm.duration || DEFAULT_DURATION,
          isFeatured: projectForm.isFeatured,
          gallery: projectForm.gallery,
          activeTab: projectForm.activeTab,
        }}
        handlers={{
          setTitle: projectForm.setTitle,
          setShortDescription: projectForm.setShortDescription,
          setDescription: projectForm.setDescription,
          setDescriptionDE: projectForm.setDescriptionDE,
          setDescriptionTR: projectForm.setDescriptionTR,
          setTechStack: projectForm.setTechStack,
          setCategory: projectForm.setCategory,
          setDuration: projectForm.setDuration,
          setIsFeatured: projectForm.setIsFeatured,
          setActiveTab: projectForm.setActiveTab,
          addGalleryImage: projectForm.addGalleryImage,
          removeGalleryImage: projectForm.removeGalleryImage,
        }}
        onCancel={resetForm}
        onSubmit={projectForm.submit}
      />
    </main>
  );
}

export default ProjectDashboard;
