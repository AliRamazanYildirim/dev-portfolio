"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useProjects } from "./hooks/useProjects";
import ProjectCard from "./components/ProjectCard";
import ProjectLoadingState from "./components/ui/ProjectLoadingState";
import ErrorState from "./components/ui/ErrorState";
import { getLocalizedText } from "./utils/getLocalizedText";

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

const ProjectsPage = () => {
  const { dictionary } = useTranslation();
  const { language } = useLanguageContext();
  const projectsDictionary = dictionary.projectsPage;

  const { projects, loading, error } = useProjects();
  const pageSize = 2;
  const listTopRef = useRef<HTMLDivElement | null>(null);

  const pagination = usePagination({
    totalItems: projects.length,
    itemsPerPage: pageSize,
    initialPage: 1,
  });

  const pageProjects = pagination.paginatedData(projects);

  const handlePageChange = (page: number) => {
    pagination.goToPage(page);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <ProjectLoadingState text={projectsDictionary.projectsLoading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
          actionLabel={projectsDictionary.retry}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <motion.section
        className="text-zinc-900 dark:text-white px-5 pb-10 md:px-20 md:pb-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <div className="mb-10" ref={listTopRef}>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent leading-tight w-max whitespace-nowrap">
              {projectsDictionary.heading}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 md:text-lg">
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
            {pageProjects.map((project: any) => (
              <motion.div
                key={project.slug}
                className="cursor-pointer group"
                variants={itemVariants}
              >
                <ProjectCard
                  project={project}
                  language={language}
                  projectsDictionary={projectsDictionary}
                />
              </motion.div>
            ))}
          </motion.div>

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
    </div>
  );
};

export default ProjectsPage;
