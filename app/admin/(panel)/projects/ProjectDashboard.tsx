"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import NoiseBackground from "@/components/NoiseBackground";
import toast from "react-hot-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { usePagination } from "@/hooks/usePagination";
import { INVOICE_CONSTANTS } from "@/constants/invoice";
import { ProjectsHero } from "./components/ProjectsHero";
import { ProjectsToolbar } from "./components/ProjectsToolbar";
import { ProjectList } from "./components/ProjectList";
import { ProjectFormModal } from "./components/ProjectFormModal";
import {
  formatCreatedDate,
  getDescriptionText,
  mapApiProject,
} from "./lib/format";
import type { Project, ProjectSortOption } from "./types";

const ITEMS_PER_PAGE = 2;
const DEFAULT_DURATION: string = INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION[0];

export function ProjectDashboard() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectSortOption>("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveResults, setLiveResults] = useState<Project[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const listTopRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionDE, setDescriptionDE] = useState("");
  const [descriptionTR, setDescriptionTR] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState<string>(DEFAULT_DURATION);
  const [isFeatured, setIsFeatured] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"en" | "de" | "tr">("en");

  const filteredProjects = useMemo(() => {
    let data = [...projects];

    if (searchQuery.trim()) {
      const needle = searchQuery.toLowerCase();
      data = data.filter((project) =>
        project.title.toLowerCase().includes(needle)
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
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
        break;
      case "name_desc":
        data.sort((a, b) =>
          b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      const json = await response.json();
      if (json.success) {
        setProjects(json.data.map(mapApiProject));
      } else {
        setProjects([]);
      }
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    goToPage(1);
  }, [searchQuery, filter, goToPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      goToPage(totalPages);
    }
  }, [filteredProjects.length, currentPage, totalPages, goToPage]);

  const paginatedProjects = paginatedData(filteredProjects);

  const handlePageChange = (page: number) => {
    goToPage(page);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery((value) => value.trim());
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      const trimmed = value.trim();
      if (!trimmed) {
        setLiveResults([]);
        setShowDropdown(false);
        return;
      }
      const matches = projects.filter((project) =>
        project.title.toLowerCase().includes(trimmed.toLowerCase())
      );
      setLiveResults(matches.slice(0, 6));
      setShowDropdown(matches.length > 0);
    }, 250);
  };

  const handleSuggestionSelect = (project: Project) => {
    setSearchQuery(project.title);
    setShowDropdown(false);
  };

  const handleDropdownVisibility = (visible: boolean) => {
    if (visible && liveResults.length === 0) return;
    setShowDropdown(visible);
  };

  const setSidebarOpenState = (open: boolean) => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    window.dispatchEvent(
      new CustomEvent("admin-sidebar:set", { detail: { open } })
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDescriptionDE("");
    setDescriptionTR("");
    setShortDescription("");
    setTechStack("");
    setCategory("");
    setDuration(DEFAULT_DURATION);
    setIsFeatured(false);
    setGallery([]);
    setEditingProject(null);
    setShowForm(false);
    setActiveTab("en");
    setSidebarOpenState(true);
  };

  const openForm = () => {
    setSidebarOpenState(false);
    setShowForm(true);
  };

  const saveProject = async () => {
    try {
      if (!title.trim()) {
        toast.error("Project title is required!");
        return;
      }
      if (!description.trim()) {
        toast.error("Project description is required!");
        return;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      const techArray = techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);

      const payload = {
        slug,
        title,
        description: {
          en: description,
          de: descriptionDE,
          tr: descriptionTR,
        },
        role: "Full Stack Developer",
        duration,
        category,
        technologies: JSON.stringify(techArray),
        mainImage: gallery[0] || "/placeholder.jpg",
        gallery,
        featured: isFeatured,
        previousSlug: null,
        nextSlug: null,
      };

      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const action = async () => {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await response.json();
        if (!response.ok || !json.success) {
          throw new Error(json?.error || `HTTP ${response.status}`);
        }
        return editingProject ? "Project updated!" : "Project saved!";
      };

      await toast.promise(action(), {
        loading: editingProject ? "Updating project..." : "Saving project...",
        success: (message) =>
          typeof message === "string" ? message : "Success",
        error: (error) =>
          error instanceof Error ? error.message : "Operation failed",
      });

      await fetchProjects();
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Save failed");
      }
    }
  };

  const deleteProject = async (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 w-96">
          <p className="font-semibold">
            Are you sure you want to delete this project?
          </p>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const action = async () => {
                    const response = await fetch(`/api/admin/projects/${id}`, {
                      method: "DELETE",
                    });
                    const json = await response.json();
                    if (!response.ok || !json.success) {
                      throw new Error(json?.error || `HTTP ${response.status}`);
                    }
                    return "Project deleted successfully!";
                  };

                  await toast.promise(action(), {
                    loading: "Deleting project...",
                    success: (message) =>
                      typeof message === "string" ? message : "Deleted",
                    error: (error) =>
                      error instanceof Error ? error.message : "Delete failed",
                  });

                  await fetchProjects();
                } catch (error) {
                  if (error instanceof Error) {
                    toast.error(error.message);
                  } else {
                    toast.error("Delete failed");
                  }
                }
              }}
              className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const editProject = (project: Project) => {
    setTitle(project.title);
    if (typeof project.description === "object") {
      setDescription(project.description.en || "");
      setDescriptionDE(project.description.de || "");
      setDescriptionTR(project.description.tr || "");
    } else {
      setDescription(project.description || "");
      setDescriptionDE("");
      setDescriptionTR("");
    }
    setShortDescription(
      typeof project.shortDescription === "string"
        ? project.shortDescription
        : getDescriptionText(project.shortDescription)
    );
    setTechStack(project.techStack.join(", "));
    setCategory(project.category || "");
    setDuration(project.duration || DEFAULT_DURATION);
    setIsFeatured(project.isFeatured);
    setGallery(project.gallery.map((img) => img.url));
    setEditingProject(project);
    setSidebarOpenState(false);
    setShowForm(true);
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

  if (!isAuthenticated) {
    return null;
  }

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

  const statsText =
    filteredProjects.length === 0
      ? projects.length === 0
        ? "No projects yet"
        : "No projects match your current search or filter"
      : `Showing ${getCurrentRange().start} - ${getCurrentRange().end} of ${
          getCurrentRange().total
        }`;

  const totalLabel = `Projects (${
    filteredProjects.length === projects.length
      ? projects.length
      : `${filteredProjects.length} / ${projects.length}`
  })`;

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
                  onSearchSubmit={handleSearchSubmit}
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
                onDeleteProject={deleteProject}
                formatCreatedDate={formatCreatedDate}
                getDescriptionText={getDescriptionText}
              />
            </div>
          </div>
        </NoiseBackground>
      </div>

      <ProjectFormModal
        visible={showForm}
        editingProject={Boolean(editingProject)}
        values={{
          title,
          shortDescription,
          description,
          descriptionDE,
          descriptionTR,
          techStack,
          category,
          duration,
          isFeatured,
          gallery,
          activeTab,
        }}
        handlers={{
          setTitle,
          setShortDescription,
          setDescription,
          setDescriptionDE,
          setDescriptionTR,
          setTechStack,
          setCategory,
          setDuration,
          setIsFeatured,
          setActiveTab,
          addGalleryImage: (url: string) =>
            setGallery((prev) => [...prev, url]),
          removeGalleryImage: (index: number) =>
            setGallery((prev) => prev.filter((_, i) => i !== index)),
        }}
        onCancel={resetForm}
        onSubmit={saveProject}
      />
    </main>
  );
}

export default ProjectDashboard;
