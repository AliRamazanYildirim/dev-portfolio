"use client";

import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedText, type Locales } from "../utils/getLocalizedText";
import { useProject } from "./hooks/useProject";
import { NAV_HEIGHT } from "@/components/ui/nav/shared";
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
import { Code2, Layers3, Sparkles } from "lucide-react";

const centeredViewportStyle = {
  minHeight: `calc(100dvh - ${NAV_HEIGHT})`,
};

interface TechnologyGroup {
  title: string;
  items: string[];
}

const technologyCardVariants = [
  "border-amber-300/70 bg-linear-to-br from-amber-100/70 via-white to-amber-50/50 dark:border-amber-400/30 dark:from-amber-500/10 dark:via-zinc-900 dark:to-amber-300/5",
  "border-cyan-300/70 bg-linear-to-br from-cyan-100/70 via-white to-sky-50/50 dark:border-cyan-400/30 dark:from-cyan-500/10 dark:via-zinc-900 dark:to-sky-300/5",
  "border-emerald-300/70 bg-linear-to-br from-emerald-100/70 via-white to-lime-50/60 dark:border-emerald-400/30 dark:from-emerald-500/10 dark:via-zinc-900 dark:to-lime-300/5",
  "border-rose-300/70 bg-linear-to-br from-rose-100/70 via-white to-orange-50/60 dark:border-rose-400/30 dark:from-rose-500/10 dark:via-zinc-900 dark:to-orange-300/5",
] as const;

const sanitizeTechnologyItems = (items: string[]) =>
  Array.from(
    new Set(
      items
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

const parseTechnologyGroups = (
  technologies: ProjectDetail["technologies"],
  fallbackTitle: string,
): TechnologyGroup[] => {
  const rawEntries = (
    Array.isArray(technologies) ? technologies : [technologies]
  )
    .map((entry) => String(entry ?? "").trim())
    .filter(Boolean);

  if (rawEntries.length === 0) {
    return [];
  }

  const hasStructuredSyntax = rawEntries.some(
    (entry) => entry.includes("|") || entry.includes(":"),
  );

  if (!hasStructuredSyntax) {
    const items = sanitizeTechnologyItems(
      rawEntries.flatMap((entry) => entry.split(",")),
    );
    return items.length > 0 ? [{ title: fallbackTitle, items }] : [];
  }

  const chunks = rawEntries
    .flatMap((entry) => entry.split("|"))
    .map((entry) => entry.trim())
    .filter(Boolean);

  const groups: TechnologyGroup[] = [];

  chunks.forEach((chunk, index) => {
    const separatorIndex = chunk.indexOf(":");

    if (separatorIndex > 0) {
      const title = chunk.slice(0, separatorIndex).trim();
      const body = chunk.slice(separatorIndex + 1).trim();
      const items = sanitizeTechnologyItems(body.split(","));

      if (items.length > 0) {
        groups.push({
          title: title || `${fallbackTitle} ${index + 1}`,
          items,
        });
      }

      return;
    }

    const items = sanitizeTechnologyItems(chunk.split(","));
    if (items.length > 0) {
      groups.push({
        title: `${fallbackTitle} ${index + 1}`,
        items,
      });
    }
  });

  if (groups.length > 0) {
    return groups;
  }

  const fallbackItems = sanitizeTechnologyItems(
    rawEntries.flatMap((entry) => entry.split(",")),
  );

  return fallbackItems.length > 0
    ? [{ title: fallbackTitle, items: fallbackItems }]
    : [];
};

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
      <div
        className="text-zinc-900 dark:text-white px-5 md:px-20 flex items-center justify-center"
        style={centeredViewportStyle}
      >
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
      <div
        className="text-zinc-900 dark:text-white px-5 md:px-20 flex items-center justify-center"
        style={centeredViewportStyle}
      >
        <div className="text-center">
          <h1 className="heading md:text-lgHeading mb-4 bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
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
  const technologyGroups = parseTechnologyGroups(
    technologies,
    projectTexts.technologiesHeading,
  );
  const technologyCount = technologyGroups.reduce(
    (total, group) => total + group.items.length,
    0,
  );
  const hasSingleTechnologyGroup = technologyGroups.length === 1;
  const technologyGridColumnsClass =
    technologyGroups.length >= 5
      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <div>
      <section className="text-zinc-900 dark:text-white px-5 py-10 md:px-20 md:py-20">
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
            featured={(project as ProjectDetail).featured}
            featuredLabel={projectTexts.featuredBadge}
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
            <h2 className="heading md:text-lgHeading mb-5 bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
              {projectTexts.technologiesHeading}
            </h2>

            <div className="relative isolate overflow-hidden rounded-4xl border border-zinc-200/80 dark:border-zinc-700/70 bg-white/80 dark:bg-zinc-950/70 p-6 md:p-8 shadow-[0_30px_80px_-45px_rgba(24,24,27,0.5)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_12%_20%,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_86%_82%,rgba(8,145,178,0.2),transparent_45%),linear-gradient(125deg,rgba(255,255,255,0.45),transparent_55%)] dark:[background:radial-gradient(circle_at_12%_20%,rgba(245,158,11,0.2),transparent_45%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.18),transparent_45%),linear-gradient(125deg,rgba(39,39,42,0.4),transparent_55%)]"
              />

              <div className="relative z-10 mb-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                  <Layers3 className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                  {String(technologyGroups.length).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                  <Code2 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                  {String(technologyCount).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center justify-center rounded-full border border-zinc-300/80 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 p-2 text-zinc-700 dark:text-zinc-200">
                  <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                </span>
              </div>

              <div
                className={`relative z-10 grid gap-4 ${technologyGridColumnsClass}`}
              >
                {technologyGroups.map((group, groupIndex) => (
                  <article
                    key={`${group.title}-${groupIndex}`}
                    className={`group relative overflow-hidden rounded-2xl border p-5 md:p-6 backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-35px_rgba(24,24,27,0.55)] ${technologyCardVariants[groupIndex % technologyCardVariants.length]} ${hasSingleTechnologyGroup ? "md:col-span-2" : ""}`}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/35 blur-2xl transition duration-500 group-hover:scale-125 dark:bg-white/10"
                    />

                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h3 className="content md:text-lgContent font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {group.title}
                      </h3>
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-zinc-300/80 dark:border-zinc-600 bg-white/70 dark:bg-zinc-900/80 px-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                        {String(group.items.length).padStart(2, "0")}
                      </span>
                    </div>

                    <div
                      className={
                        hasSingleTechnologyGroup
                          ? "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4"
                          : "flex flex-wrap gap-2.5"
                      }
                    >
                      {group.items.map((item, itemIndex) => (
                        <span
                          key={`${item}-${itemIndex}`}
                          className={`rounded-full border border-zinc-300/70 dark:border-zinc-600 bg-white/75 dark:bg-zinc-900/70 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:shadow-none transition duration-300 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 ${hasSingleTechnologyGroup ? "inline-flex min-h-10 items-center justify-center text-center" : ""}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
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
