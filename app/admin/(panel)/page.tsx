"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import NoiseBackground from "@/components/NoiseBackground";
import ImageUpload from "@/components/ui/ImageUpload";
import { INVOICE_CONSTANTS } from "@/constants/invoice";
import Pagination from "@/components/ui/Pagination";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { usePagination } from "@/hooks/usePagination";
import toast from "react-hot-toast";

// Interface-Definitionen - Interface definitions
interface Project {
  id: string;
  title: string;
  description: { en: string; de: string; tr: string } | string;
  shortDescription: string;
  techStack: string[];
  isFeatured: boolean;
  category?: string;
  gallery: { url: string }[];
}

export default function AdminPage() {
  // Admin-Authentifizierung - Admin authentication
  const {
    isAuthenticated,
    user,
    loading: authLoading,
    logout,
  } = useAdminAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination için ref
  const listTopRef = useRef<HTMLDivElement | null>(null);

  // Pagination Hook - 2'er 2'er sayfalama
  const pagination = usePagination({
    totalItems: projects.length,
    itemsPerPage: 2,
    initialPage: 1,
  });

  // Formular-Status - Form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionDE, setDescriptionDE] = useState<string>("");
  const [descriptionTR, setDescriptionTR] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [techStack, setTechStack] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [duration, setDuration] = useState<string>(
    INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION[0]
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [gallery, setGallery] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"en" | "de" | "tr">("en");

  useEffect(() => {
    fetchProjects();
  }, []);

  // Projekte laden - Load projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const result = await res.json();

      if (result.success) {
        // API-Response formatieren für Admin-Panel - Format API response for admin panel
        const formattedProjects = result.data.map((project: any) => {
          let techStack = [];

          // Technologies-Feld sicher parsen - Parse technologies field safely
          try {
            if (typeof project.technologies === "string") {
              // JSON-String parsen - Parse JSON string
              techStack = JSON.parse(project.technologies);
            } else if (Array.isArray(project.technologies)) {
              // Array direkt verwenden - Use array directly
              techStack = project.technologies;
            } else {
              techStack = [];
            }
          } catch (parseError) {
            // Fallback bei Parse-Fehler - Fallback on parse error
            techStack =
              typeof project.technologies === "string"
                ? project.technologies
                    .split(",")
                    .map((tech: string) => tech.trim())
                    .filter((tech: string | any[]) => tech.length > 0)
                : [];
          }

          // Handle description - ALWAYS convert to string for display
          let desc = "No description available";
          let descriptionObj = project.description;

          if (
            typeof project.description === "object" &&
            project.description !== null
          ) {
            // It's already a translation object
            desc =
              project.description.en ||
              project.description.de ||
              project.description.tr ||
              "No description available";
            descriptionObj = project.description;
          } else if (typeof project.description === "string") {
            // It's a plain string
            desc = project.description;
            descriptionObj = project.description;
          }

          // Ensure shortDescription is ALWAYS a plain string - NO OBJECTS!
          const shortDesc =
            desc.length > 150 ? desc.substring(0, 150) + "..." : desc;

          return {
            id: project.id || project._id || project._id?.toString(),
            title: project.title || "Untitled",
            description: descriptionObj, // Keep original for editing
            shortDescription: String(shortDesc), // FORCE STRING CONVERSION
            techStack: techStack,
            category: project.category || "",
            isFeatured: project.featured || false,
            gallery: project.gallery || [],
          };
        });
        setProjects(formattedProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Erstellte Projekte abrufen
  const paginatedProjects = pagination.paginatedData(projects);

  // Beim Seitenwechsel weiches Scrollen
  const handlePageChange = (page: number) => {
    pagination.goToPage(page);
    // Weiches Scrollen
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Formular zurücksetzen - Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDescriptionDE("");
    setDescriptionTR("");
    setShortDescription("");
    setTechStack("");
    setCategory("");
    setDuration(INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION[0]);
    setIsFeatured(false);
    setGallery([]);
    setEditingProject(null);
    setShowForm(false);
    setActiveTab("en");
  };

  // Projekt speichern - Save project
  const saveProject = async () => {
    try {
      // Validierung - Validation
      if (!title.trim()) {
        toast.error("Project title is required!");
        return;
      }
      if (!description.trim()) {
        toast.error("Project description is required!");
        return;
      }

      // Slug generieren - Generate slug
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      const techArray = techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const projectData = {
        slug,
        title,
        description: {
          en: description,
          de: descriptionDE,
          tr: descriptionTR,
        },
        role: "Full Stack Developer",
        duration: duration,
        category,
        technologies: JSON.stringify(techArray),
        mainImage: gallery[0] || "/placeholder.jpg",
        gallery: gallery,
        featured: isFeatured,
        // Note: previousSlug and nextSlug values are calculated dynamically by the API
        previousSlug: null,
        nextSlug: null,
      };

      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const promise = (async () => {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json?.error || `HTTP ${res.status}`);
        }
        return editingProject ? "Project updated!" : "Project saved!";
      })();

      await toast.promise(promise, {
        loading: editingProject ? "Updating project..." : "Saving project...",
        success: (msg) => (typeof msg === "string" ? msg : "Success"),
        error: (e) => (e instanceof Error ? e.message : "Operation failed"),
      });

      // Only after success
      fetchProjects();
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Save failed");
    }
  };

  // Projekt löschen - Delete project
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
                  const promise = (async () => {
                    const res = await fetch(`/api/admin/projects/${id}`, {
                      method: "DELETE",
                    });
                    const json = await res.json();
                    if (!res.ok || !json.success) {
                      throw new Error(json?.error || `HTTP ${res.status}`);
                    }
                    return "Project deleted successfully!";
                  })();

                  await toast.promise(promise, {
                    loading: "Deleting project...",
                    success: (msg) =>
                      typeof msg === "string" ? msg : "Deleted",
                    error: (e) =>
                      e instanceof Error ? e.message : "Delete failed",
                  });

                  // Refresh on success
                  fetchProjects();
                } catch (error: any) {
                  toast.error(error?.message || "Delete failed");
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

    // Handle multilingual description
    if (typeof project.description === "object") {
      setDescription(project.description.en || "");
      setDescriptionDE(project.description.de || "");
      setDescriptionTR(project.description.tr || "");
    } else {
      setDescription(project.description || "");
      setDescriptionDE("");
      setDescriptionTR("");
    }

    setShortDescription(project.shortDescription);
    setTechStack(project.techStack.join(", "));
    setCategory(project.category || "");
    setIsFeatured(project.isFeatured);
    setGallery(project.gallery.map((img) => img.url));
    setEditingProject(project);
    setShowForm(true);
  };

  // Helper: Get string from description (object or string)
  const getDescriptionText = (desc: any): string => {
    if (!desc) return "";
    if (typeof desc === "string") return desc;
    if (typeof desc === "object" && desc !== null) {
      return desc.en || desc.de || desc.tr || "";
    }
    return String(desc);
  };

  // Authentication loading
  if (authLoading) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <NoiseBackground mode="dark" intensity={0.1}>
          <div className="relative z-10 flex items-center justify-center min-h-screen w-full h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Session is being verified...</p>
            </div>
          </div>
        </NoiseBackground>
      </div>
    );
  }

  // Nicht authentifiziert - Not authenticated (wird durch useAdminAuth weitergeleitet)
  // Not authenticated (will be redirected by useAdminAuth)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="relative flex justify-center items-center flex-col overflow-x-hidden mx-auto">
      <div className="w-full">
        <NoiseBackground mode="dark" intensity={0.1}>
          {/* Header - Responsive Design Upgrade */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:pt-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h1 className="title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-2">
                    Admin Panel
                  </h1>
                  <p className="content text-base sm:text-lg text-white/70">
                    Manage your projects
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 sm:gap-4">
                  <button
                    onClick={() => setShowForm(true)}
                    className="button bg-white text-[#131313] px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
                  >
                    <span className="flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-base">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      New Project
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Responsive Design Upgrade */}
          <div className="relative z-10 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:pt-0">
              {/* Projects Header with Pagination Ref */}
              <div className="mb-6" ref={listTopRef}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Projects ({projects.length})
                </h2>
                <p className="text-white/70">
                  {projects.length === 0
                    ? "No projects yet"
                    : `Showing ${pagination.getCurrentRange().start} - ${
                        pagination.getCurrentRange().end
                      } of ${pagination.getCurrentRange().total}`}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 sm:py-24">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="grid gap-6 sm:gap-8">
                  {projects && projects.length > 0 ? (
                    <>
                      {paginatedProjects.map((project) => (
                        <div key={project.id} className="group">
                          {/* Responsive Project Card */}
                          <div className="rounded-xl sm:rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                            <NoiseBackground
                              mode="light"
                              intensity={0.05}
                              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#131313] break-words">
                                      {project.title}
                                    </h3>
                                    {project.category && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-semibold bg-white/80 text-[#131313] border border-[#131313]/10 mr-2">
                                        {project.category}
                                      </span>
                                    )}

                                    {project.isFeatured && (
                                      <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-[#c9184a] text-white self-start">
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

                                  <p className="text-base sm:text-lg text-[#131313]/80 mb-4 sm:mb-6 leading-relaxed">
                                    {typeof project.shortDescription ===
                                    "string"
                                      ? project.shortDescription
                                      : getDescriptionText(
                                          project.shortDescription
                                        )}
                                  </p>

                                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    {project.techStack?.map((tech, i) => (
                                      <span
                                        key={`${tech}-${i}`}
                                        className="inline-flex items-center px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-amber-500/20 text-[#131313] border border-[#131313]/20"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>

                                  {project.gallery?.length > 0 && (
                                    <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
                                      {project.gallery
                                        .slice(0, 3)
                                        .map((img, index) => (
                                          <div
                                            key={`${img.url}-${index}`}
                                            className="relative flex-shrink-0"
                                          >
                                            <Image
                                              src={img.url}
                                              alt=""
                                              width={60}
                                              height={40}
                                              className="w-12 h-8 sm:w-15 sm:h-10 object-cover rounded-lg border border-[#131313]/20"
                                            />
                                          </div>
                                        ))}
                                      {project.gallery.length > 3 && (
                                        <div className="w-12 h-8 sm:w-15 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                                          <span className="text-xs font-bold text-black">
                                            +{project.gallery.length - 3}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Responsive Action Buttons - Untere rechte Ecke*/}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:ml-6 w-full lg:w-auto lg:justify-end lg:items-end lg:self-end mt-4 lg:mt-0">
                                  <button
                                    onClick={() => editProject(project)}
                                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 text-sm sm:text-base"
                                  >
                                    <svg
                                      className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
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
                                    onClick={() => deleteProject(project.id)}
                                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 text-sm sm:text-base"
                                  >
                                    <svg
                                      className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
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

                      {/* Pagination Controls - Spezialdesign für die Admin-Seite*/}
                      {projects.length > 0 && (
                        <Pagination
                          currentPage={pagination.currentPage}
                          totalPages={pagination.totalPages}
                          hasNextPage={pagination.hasNextPage}
                          hasPrevPage={pagination.hasPrevPage}
                          onPageChange={handlePageChange}
                          onNextPage={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          onPrevPage={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          getPageNumbers={pagination.getPageNumbers}
                          getCurrentRange={pagination.getCurrentRange}
                          theme="admin"
                          showInfo={true}
                          size="md"
                          className="mt-12"
                        />
                      )}
                    </>
                  ) : (
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
                          No projects yet
                        </h3>
                        <p className="text-sm sm:text-base text-[#131313]/70">
                          Click the button above to add your first project.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </NoiseBackground>
      </div>

      {/* Responsive Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="relative backdrop-blur-xl bg-white/95 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            {/* Responsive Modal Header */}
            <div className="bg-gradient-to-r from-[#131313] to-[#131313]/90 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="heading text-lg sm:text-xl lg:text-2xl text-white">
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </h2>
                  <p className="content text-white/70 text-xs sm:text-sm mt-1 hidden sm:block">
                    Fill in the project information
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Responsive Modal Body */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-180px)]">
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Project Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your amazing project name..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Short Description
                    </label>
                    <textarea
                      placeholder="Briefly summarize your project..."
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content resize-none text-sm sm:text-base"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-3">
                      Detailed Description
                    </label>

                    {/* Language Tabs */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab("en")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          activeTab === "en"
                            ? "bg-[#131313] text-white"
                            : "bg-white/50 text-[#131313] hover:bg-white/80"
                        }`}
                      >
                        🇬🇧 EN
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("de")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          activeTab === "de"
                            ? "bg-[#131313] text-white"
                            : "bg-white/50 text-[#131313] hover:bg-white/80"
                        }`}
                      >
                        🇩🇪 DE
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("tr")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          activeTab === "tr"
                            ? "bg-[#131313] text-white"
                            : "bg-white/50 text-[#131313] hover:bg-white/80"
                        }`}
                      >
                        🇹🇷 TR
                      </button>
                    </div>

                    {/* English */}
                    {activeTab === "en" && (
                      <textarea
                        placeholder="Provide detailed information about your project (English)..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content resize-none text-sm sm:text-base"
                      />
                    )}

                    {/* German */}
                    {activeTab === "de" && (
                      <textarea
                        placeholder="Detaillierte Projektinformationen (Deutsch)..."
                        value={descriptionDE}
                        onChange={(e) => setDescriptionDE(e.target.value)}
                        rows={4}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content resize-none text-sm sm:text-base"
                      />
                    )}

                    {/* Turkish */}
                    {activeTab === "tr" && (
                      <textarea
                        placeholder="Proje hakkında detaylı bilgi (Türkçe)..."
                        value={descriptionTR}
                        onChange={(e) => setDescriptionTR(e.target.value)}
                        rows={4}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content resize-none text-sm sm:text-base"
                      />
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Technologies
                    </label>
                    <input
                      type="text"
                      placeholder="React, Next.js, TypeScript (comma separated)"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    >
                      <option value="">Select category</option>
                      {INVOICE_CONSTANTS.PROJECT.DEFAULT_CATEGORY.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                      Project Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                    >
                      {INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9184a] bg-white/80 border-[#131313]/20 rounded focus:ring-[#c9184a] transition-colors"
                      />
                      <span className="text-sm font-semibold text-[#131313] group-hover:text-[#c9184a] transition-colors">
                        Mark as featured project
                      </span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#131313] mb-4">
                      Gallery Images
                    </label>
                    <div className="backdrop-blur-sm bg-white/50 border-2 border-dashed border-[#131313]/30 rounded-2xl p-8 hover:border-[#131313]/50 transition-colors duration-200">
                      <ImageUpload
                        onUpload={(url: string) =>
                          setGallery([...gallery, url])
                        }
                      />
                    </div>

                    {gallery.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-8">
                        {gallery.map((url, index) => (
                          <div
                            key={`${url}-${index}`}
                            className="relative group/delete"
                          >
                            <Image
                              src={url}
                              alt={`Gallery image ${index + 1}`}
                              width={200}
                              height={150}
                              className="w-full h-32 object-cover rounded-xl border border-[#131313]/20"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setGallery(
                                  gallery.filter((_, i) => i !== index)
                                )
                              }
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover/delete:opacity-100 transition-all duration-200 hover:scale-110"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Responsive Modal Footer */}
            <div className="bg-[#131313]/5 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-[#131313]/10 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end -mt-3">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#131313]/30 text-[#131313] rounded-xl font-medium hover:bg-[#131313]/5 transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={saveProject}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#131313] hover:bg-[#131313]/90 text-white rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-sm sm:text-base order-1 sm:order-2"
              >
                {editingProject ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
