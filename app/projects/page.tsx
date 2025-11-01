"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import NoiseBackground from "@/components/NoiseBackground";
import SplitText from "@/TextAnimations/SplitText";
import { ProjectsAPI } from "@/lib/api";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageContext } from "@/contexts/LanguageContext";

// TypeScript Interface für Projekte
interface Project {
  id: string;
  slug: string;
  title: string;
  description: { en: string; de: string; tr: string } | string;
  mainImage: string;
  featured: boolean;
  gallery: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
}

const ProjectsPage = () => {
  const { dictionary } = useTranslation();
  const { language } = useLanguageContext();
  const projectsDictionary = dictionary.projectsPage;

  // Helper: Get description text
  const getDescriptionText = (
    desc: { en: string; de: string; tr: string } | string
  ): string => {
    if (typeof desc === "string") return desc;
    return desc[language] || desc.en || desc.de || desc.tr || "";
  };

  // State für Projekte und Loading
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 2; // Elemente pro Seite (konfiguriert für mindestens 2 Projekte)
  const listTopRef = useRef<HTMLDivElement | null>(null);

  // Seitennummerierungs-Hook verwenden
  const pagination = usePagination({
    totalItems: projects.length,
    itemsPerPage: pageSize,
    initialPage: 1,
  });

  // Projekte von der API laden
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await ProjectsAPI.getAll();

        if (response.success) {
          setProjects(response.data);
        } else {
          setError(response.error || projectsDictionary.loadError);
        }
      } catch (err) {
        setError(projectsDictionary.connectionError);
        console.error("Fehler beim Laden der Projekte:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projectsDictionary]);

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

  // Erstellte Projekte abrufen
  const pageProjects = pagination.paginatedData(projects);

  // Beim Seitenwechsel weiches Scrollen
  const handlePageChange = (page: number) => {
    pagination.goToPage(page);
    // Smoothly scroll to the beginning of the list
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
              {projectsDictionary.projectsLoading}
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
              {projectsDictionary.retry}
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
            <h1 className="title md:text-lgTitle mb-4">
              <SplitText text={projectsDictionary.heading} />
            </h1>
            <p className="content md:text-lgContent text-gray">
              {projects.length}{" "}
              {projects.length === 1
                ? projectsDictionary.projectLabelSingular
                : projectsDictionary.projectLabelPlural}{" "}
              {projectsDictionary.resultsSuffix}
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
                    <div className="flex justify-center mb-16">
                      <div className="relative w-full max-w-[900px] aspect-[3/2] rounded-md overflow-hidden">
                        <Image
                          src={project.mainImage}
                          alt={project.title}
                          fill
                          className="object-contain hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 900px) 100vw, 900px"
                          priority
                        />
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-[#c9184a] text-white px-3 py-1 rounded-full text-sm font-bold">
                        {projectsDictionary.featured}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="content md:text-lgContent font-bold group-hover:text-[#c9184a] transition">
                      {project.title}
                    </h2>
                    <p className="button md:text-lgButton text-white mt-2 line-clamp-2">
                      {(() => {
                        const desc = getDescriptionText(project.description);
                        return desc.length > 100
                          ? `${desc.slice(0, 100)}...`
                          : desc;
                      })()}
                    </p>
                    {/* Galerie Anzahl */}
                    {/* <p className="text-sm text-white mt-2">
                      {project.gallery.length} Images
                    </p> */}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination Controls - Merkezi Pagination Bileşeni */}
          {projects.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
              onNextPage={() => handlePageChange(pagination.currentPage + 1)}
              onPrevPage={() => handlePageChange(pagination.currentPage - 1)}
              getPageNumbers={pagination.getPageNumbers}
              getCurrentRange={pagination.getCurrentRange}
              theme="admin"
              showInfo={true}
              size="md"
              className="mt-10"
            />
          )}

          {/* Keine Projekte gefunden */}
          {projects.length === 0 && (
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
                  {projectsDictionary.noneTitle}
                </h3>
                <p className="text-sm sm:text-base text-[#131313]/70">
                  {projectsDictionary.noneDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </NoiseBackground>
  );
};

export default ProjectsPage;
