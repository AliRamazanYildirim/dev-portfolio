import React from "react";
import Link from "next/link";
import ProjectImage from "./ProjectImage";
import { getLocalizedText, Locales } from "../utils/getLocalizedText";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: { en: string; de: string; tr: string } | string;
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
        <div className="relative overflow-hidden rounded-md">
          <div className="flex justify-center mb-16">
            <div className="w-full">
              <ProjectImage src={project.mainImage} alt={project.title} />
            </div>
          </div>

          {project.featured && (
            <div className="absolute top-4 right-4 bg-[#c9184a] text-white px-3 py-1 rounded-full text-sm font-bold">
              {projectsDictionary?.featured || "Featured"}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h2 className="content md:text-lgContent font-bold group-hover:text-[#c9184a] transition">
            {project.title}
          </h2>
          <p className="button md:text-lgButton text-white mt-2 line-clamp-2">
            {snippet}
          </p>
        </div>
      </Link>
    </div>
  );
}
