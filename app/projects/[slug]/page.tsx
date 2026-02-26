"use client";

import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedText, type Locales } from "../utils/getLocalizedText";
import { useProject } from "./hooks/useProject";
import {
  useLanguageContext,
  type SupportedLanguage,
} from "@/contexts/LanguageContext";
import type { ProjectDetail } from "./types";
import ProjectHeader from "./components/ProjectHeader";
import ProjectMedia from "./components/ProjectMedia";
import ProjectMeta from "./components/ProjectMeta";
import ProjectGallery from "./components/ProjectGallery";
import ProjectTags from "./components/ProjectTags";
import ProjectNav from "./components/ProjectNav";

const ProjectPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { dictionary } = useTranslation();
  const { language } = useLanguageContext();
  const projectTexts = dictionary.projectDetail;

  // Data fetching handled in `useProject` hook
  const { project, loading, error } = useProject(slug);

  // Use centralized localization helper
  // Loading State
  if (loading) {
    return (
      <div className="text-white px-5 py-10 md:px-20 md:py-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c58d12] mx-auto mb-4"></div>
          <p className="content md:text-lgContent text-zinc-400">
            {projectTexts.loading}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !project) {
    return (
      <div className="text-white px-5 py-10 md:px-20 md:py-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading md:text-lgHeading mb-4 bg-linear-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {projectTexts.notFoundTitle}
          </h1>
          <p className="content md:text-lgContent text-zinc-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push("/projects")}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#c58d12] to-[#d4a24a] px-6 py-3 font-bold text-black transition hover:shadow-[0_0_30px_rgba(197,141,18,0.4)]"
          >
            {projectTexts.notFoundAction}
          </button>
        </div>
      </div>
    );
  }

  // Safe narrowed values (we've already returned when !project)
  const technologies = (project as ProjectDetail).technologies;

  return (
    <div>
      <section className="text-white px-5 py-10 md:px-20 md:py-20">
        <div className="container mx-auto">
          {/* Header */}
          <ProjectHeader
            project={project as ProjectDetail}
            projectTexts={projectTexts}
          />

          {/* Main image */}
          <ProjectMedia
            src={(project as ProjectDetail).mainImage}
            alt={(project as ProjectDetail).title}
          />

          {/* Meta / About */}
          <ProjectMeta
            project={project as ProjectDetail}
            projectTexts={projectTexts}
            description={getLocalizedText(
              (project as ProjectDetail).description as any,
              language as Locales,
            )}
          />

          {/* Gallery */}
          <ProjectGallery
            gallery={(project as ProjectDetail).gallery || []}
            title={(project as ProjectDetail).title}
            heading={projectTexts.galleryHeading}
          />

          {/* Technologies */}
          <div className="mb-16">
            <h2 className="heading md:text-lgHeading mb-4 bg-linear-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {projectTexts.technologiesHeading}
            </h2>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="content md:text-lgContent text-white leading-relaxed">
                {Array.isArray(technologies)
                  ? technologies.join(", ")
                  : technologies}
              </p>
            </div>
          </div>

          {/* Tags */}
          <ProjectTags tags={(project as ProjectDetail).tags || []} />

          {/* Navigation */}
          <ProjectNav
            previousSlug={(project as ProjectDetail).previousSlug}
            nextSlug={(project as ProjectDetail).nextSlug}
            projectTexts={projectTexts}
          />
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
