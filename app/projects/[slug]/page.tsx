"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NoiseBackground from "@/components/NoiseBackground";
import { ProjectsAPI } from "@/lib/api";
import { use } from "react";

// TypeScript Interface für Projekt Details
interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  role: string;
  duration: string;
  category: string;
  technologies: string;
  mainImage: string;
  featured: boolean;
  previousSlug: string | null;
  nextSlug: string | null;
  gallery: Array<{
    id: string;
    url: string;
    alt: string;
    order: number;
  }>;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const ProjectPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const { slug } = use(params);

  // State für Projekt und Loading
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Projekt von der API laden
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await ProjectsAPI.getBySlug(slug);

        if (response.success) {
          setProject(response.data);
        } else {
          setError(response.error || "Projekt nicht gefunden");
        }
      } catch (err) {
        setError("Fehler beim Laden des Projekts");
        console.error("Fehler beim Laden des Projekts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  // Loading State
  if (loading) {
    return (
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="text-white px-5 py-10 md:px-20 md:py-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="content md:text-lgContent">Projekt wird geladen...</p>
          </div>
        </div>
      </NoiseBackground>
    );
  }

  // Error State
  if (error || !project) {
    return (
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="text-white px-5 py-10 md:px-20 md:py-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="heading md:text-lgHeading mb-4">
              Projekt nicht gefunden
            </h1>
            <p className="content md:text-lgContent text-gray mb-6">{error}</p>
            <button
              onClick={() => router.push("/projects")}
              className="button md:text-lgButton border border-white px-6 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Zurück zu den Projekten
            </button>
          </div>
        </div>
      </NoiseBackground>
    );
  }

  return (
    <NoiseBackground mode="dark" intensity={0.1}>
      <section className="text-white px-5 py-10 md:px-20 md:py-20">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h1 className="heading md:text-lgHeading">{project.title}</h1>
              {/* Featured Badge */}
              {project.featured && (
                <span className="bg-[#c9184a] text-white px-4 py-2 rounded-full text-sm font-bold">
                  Featured Project
                </span>
              )}
            </div>
            <p className="content md:text-lgContent text-white text-sm">
              von {project.author} •{" "}
              {new Date(project.createdAt).toLocaleDateString("de-DE")}
            </p>
          </div>

          {/* Main Image */}
          <div className="flex justify-center mb-16">
            <Image
              src={project.mainImage}
              alt={project.title}
              width={900}
              height={300}
              className="rounded-md w-full max-w-4xl"
              priority
            />
          </div>

          {/* Project Details Grid */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="heading md:text-lgHeading font-bold mb-4">
                About The Project
              </h2>
            </div>
            <div>
              <p className="content md:text-lgContent text-white text-lg leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Project Meta Information */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div>
                <p className="font-bold content md:text-lgContent text-white">
                  Project Role
                </p>
                <p className="text-white">{project.role}</p>
              </div>
              <div>
                <p className="font-bold content md:text-lgContent text-white">
                  Duration
                </p>
                <p className="text-white">{project.duration}</p>
              </div>
              <div>
                <p className="font-bold content md:text-lgContent text-white">
                  Category
                </p>
                <p className="text-white">{project.category}</p>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mb-16">
              <h2 className="heading md:text-lgHeading mb-6">
                Project Galerie
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <Image
                      key={image.id}
                      src={image.url}
                      alt={image.alt || `${project.title} screenshot`}
                      width={400}
                      height={300}
                      className="rounded-md w-full hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Technologies Section */}
          <div className="mb-16">
            <h2 className="heading md:text-lgHeading mb-4">
              Technologies Used
            </h2>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="content md:text-lgContent text-white leading-relaxed">
                {project.technologies}
              </p>
            </div>
          </div>

          {/* Tags Section */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-16">
              <h2 className="heading md:text-lgHeading mb-4">Tags</h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: tag.color + "20",
                      borderColor: tag.color,
                      color: tag.color,
                      border: `1px solid ${tag.color}`,
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Section */}
          <div className="flex justify-between items-center border-t border-gray-700 pt-8">
            <button
              onClick={() =>
                project.previousSlug
                  ? router.push(`/projects/${project.previousSlug}`)
                  : router.push("/projects")
              }
              className="text-white hover:text-[#c9184a] heading md:text-lgHeading font-bold transition flex items-center gap-2"
            >
              <span>&lt;</span>
              {project.previousSlug ? "Last" : "Projects"}
            </button>

          

            <button
              onClick={() =>
                project.nextSlug
                  ? router.push(`/projects/${project.nextSlug}`)
                  : router.push("/projects")
              }
              className="text-white hover:text-[#c9184a] heading md:text-lgHeading font-bold transition flex items-center gap-2"
            >
              {project.nextSlug ? "Next" : "Projects"}
              <span>&gt;</span>
            </button>
          </div>
        </div>
      </section>
    </NoiseBackground>
  );
};

export default ProjectPage;
