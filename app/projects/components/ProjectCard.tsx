import React from "react";
import Link from "next/link";
import ProjectImage from "./ProjectImage";
import { getLocalizedText, Locales } from "../utils/getLocalizedText";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: { en: string; de: string; tr: string; fr: string } | string;
  mainImage: string;
  featured?: boolean;
  gallery?: Array<any>;
}

interface Props {
  project: Project;
  language: Locales;
  projectsDictionary: any;
}

export default function ProjectCard({
  project,
  language,
  projectsDictionary,
}: Props) {
  const desc = getLocalizedText(project.description, language);
  const snippet = desc.length > 100 ? `${desc.slice(0, 100)}...` : desc;

  return (
    <div className="cursor-pointer group">
      <Link href={`/projects/${project.slug}`}>
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-linear-to-br dark:from-zinc-900 dark:to-black transition-all duration-500 hover:border-[#c58d12]/50">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#c58d12]/0 to-[#c58d12]/0 transition-all duration-500 group-hover:from-[#c58d12]/5 group-hover:to-[#c58d12]/8 pointer-events-none" />
          <div className="flex justify-center">
            <div className="w-full">
              <ProjectImage src={project.mainImage} alt={project.title} />
            </div>
          </div>

          {project.featured && (
            <div className="absolute top-0 right-0 z-30">
              <div className="rounded-bl-2xl rounded-tr-2xl border-b border-l border-[#c58d12]/40 bg-[#c58d12]/15 px-4 py-2 text-sm font-semibold text-[#c58d12]">
                {projectsDictionary?.featured || "Featured"}
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-[#c58d12] to-transparent transition-all duration-500 group-hover:w-full" />
        </div>

        <div className="mt-4 px-1">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white transition-colors duration-300 group-hover:text-[#c58d12]">
            {project.title}
          </h2>
          <p className="text-zinc-800 dark:text-zinc-200 mt-2 text-lg md:text-xl line-clamp-2">
            {snippet}
          </p>
        </div>
      </Link>
    </div>
  );
}
