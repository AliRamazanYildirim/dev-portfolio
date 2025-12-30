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
          <span className="bg-[#c9184a] text-white px-4 py-2 rounded-full text-sm font-bold">
            {projectTexts.featuredBadge}
          </span>
        )}
      </div>
      <p className="content md:text-lgContent text-white text-sm">
        {projectTexts.authorPrefix
          ? `${projectTexts.authorPrefix} ${project.author}`
          : project.author}
        {" \u2022 "}
        {new Date(project.createdAt).toLocaleDateString(
          projectTexts.dateLocale
        )}
      </p>
    </div>
  );
}
