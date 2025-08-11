"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import NoiseBackground from "@/components/NoiseBackground";
import SplitText from "@/TextAnimations/SplitText";
import { ProjectsAPI } from "@/lib/api";

// TypeScript Interface für Projekte
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  mainImage: string;
  featured: boolean;
  gallery: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
}

const ProjectsPage = () => {
  // State für Projekte und Loading
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 2; // Elemente pro Seite (konfiguriert für mindestens 2 Projekte)
  const listTopRef = useRef<HTMLDivElement | null>(null);

  // Projekte von der API laden
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await ProjectsAPI.getAll();

        if (response.success) {
          setProjects(response.data);
        } else {
          setError(response.error || "Fehler beim Laden der Projekte");
        }
      } catch (err) {
        setError("Verbindungsfehler beim Laden der Projekte");
        console.error("Fehler beim Laden der Projekte:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // Pagination helpers
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(projects.length / pageSize));
  }, [projects.length]);

  const pageProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return projects.slice(start, end);
  }, [projects, currentPage]);

  // Falls sich die Projektanzahl ändert, aktuelle Seite im gültigen Bereich halten
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const goToPage = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    // Sanft zum Listenanfang scrollen
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Loading State
  if (loading) {
    return (
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="text-white px-5 pb-10 md:px-20 md:pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="content md:text-lgContent">
             Projects are loading...
            </p>
          </div>
        </div>
      </NoiseBackground>
    );
  }

  // Error State
  if (error) {
    return (
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="text-white px-5 pb-10 md:px-20 md:pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="content md:text-lgContent text-red-400 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="button md:text-lgButton border border-white px-6 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Try again
            </button>
          </div>
        </div>
      </NoiseBackground>
    );
  }

  return (
    <NoiseBackground mode="dark" intensity={0.1}>
      <motion.section
        className="text-white px-5 pb-10 md:px-20 md:pb-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto">
          {/* Header mit Projektanzahl */}
          <div className="mb-10" ref={listTopRef}>
            <SplitText text="Projects" className="title md:text-lgTitle mb-4" />
            <p className="content md:text-lgContent text-gray">
              {projects.length} {projects.length === 1 ? "Project" : "projects"}{" "}
              found
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {pageProjects.map((project) => (
              <motion.div
                key={project.slug}
                className="cursor-pointer group"
                variants={itemVariants}
              >
                <Link href={`/projects/${project.slug}`}>
                  <div className="relative overflow-hidden rounded-md">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      width={1920}
                      height={1080}
                      className="w-full rounded-md hover:scale-105 transition-transform duration-300"
                    />
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-[#c9184a] text-white px-3 py-1 rounded-full text-sm font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="content md:text-lgContent font-bold group-hover:text-[#c9184a] transition">
                      {project.title}
                    </h2>
                    <p className="button md:text-lgButton text-white mt-2 line-clamp-2">
                      {project.description.length > 100
                        ? `${project.description.slice(0, 100)}...`
                        : project.description}
                    </p>
                    {/* Galerie Anzahl */}
                    <p className="text-sm text-white mt-2">
                      {project.gallery.length} Images
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination Controls (unten) - polished UI */}
          {projects.length > 0 && totalPages > 1 && (
            <nav className="mt-10 select-none" aria-label="Pagination">
              <div className="w-full flex items-center justify-center">
                <div className="backdrop-blur bg-white/5 border border-white/10 rounded-2xl px-2 py-2 sm:px-3 sm:py-3 shadow-lg">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Prev */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center border transition ${
                        currentPage === 1
                          ? "border-white/10 text-white/40 cursor-not-allowed"
                          : "border-white/20 text-white hover:bg-white/10"
                      }`}
                      aria-label="Vorherige Seite"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Page numbers with ellipsis */}
                    {(() => {
                      const items: Array<number | "…"> = (() => {
                        if (totalPages <= 7)
                          return Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          );
                        const arr: Array<number | "…"> = [1];
                        const left = Math.max(2, currentPage - 1);
                        const right = Math.min(totalPages - 1, currentPage + 1);
                        if (left > 2) arr.push("…");
                        for (let p = left; p <= right; p++) arr.push(p);
                        if (right < totalPages - 1) arr.push("…");
                        arr.push(totalPages);
                        return arr;
                      })();

                      return items.map((it, idx) => {
                        if (it === "…") {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center text-white/60"
                            >
                              …
                            </span>
                          );
                        }
                        const page = it as number;
                        const active = page === currentPage;
                        return (
                          <button
                            key={`p-${page}`}
                            onClick={() => goToPage(page)}
                            className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center border transition ${
                              active
                                ? "bg-white text-black border-white"
                                : "border-white/20 text-white hover:bg-white/10"
                            }`}
                            aria-current={active ? "page" : undefined}
                            aria-label={`Seite ${page}`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}

                    {/* Next */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center border transition ${
                        currentPage === totalPages
                          ? "border-white/10 text-white/40 cursor-not-allowed"
                          : "border-white/20 text-white hover:bg-white/10"
                      }`}
                      aria-label="Nächste Seite"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-white/70">
                Seite {currentPage} von {totalPages}
              </p>
            </nav>
          )}

          {/* Keine Projekte gefunden */}
          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="content md:text-lgContent text-gray mb-4">
                No projects found.
              </p>
              <p className="button md:text-lgButton text-gray">
                Check back later!
              </p>
            </div>
          )}
        </div>
      </motion.section>
    </NoiseBackground>
  );
};

export default ProjectsPage;
