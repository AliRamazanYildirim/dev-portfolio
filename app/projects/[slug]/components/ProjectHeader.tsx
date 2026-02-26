import React from "react";
import type { ProjectDetail } from "../types";

interface Props {
  project: ProjectDetail;
  projectTexts: any;
}

export default function ProjectHeader({ project, projectTexts }: Props) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="heading md:text-lgHeading">{project.title}</h1>
        {project.featured && (
          <span className="rounded-full border border-[#c58d12]/40 bg-[#c58d12]/10 px-4 py-2 text-sm font-bold text-[#c58d12]">
            {projectTexts.featuredBadge}
          </span>
        )}
      </div>
      <p className="content md:text-lgContent text-zinc-500 dark:text-white text-sm">
        {projectTexts.authorPrefix
          ? `${projectTexts.authorPrefix} ${project.author}`
          : project.author}
        {" \u2022 "}
        {new Date(project.createdAt).toLocaleDateString(
          projectTexts.dateLocale,
        )}
      </p>
    </div>
  );
}
