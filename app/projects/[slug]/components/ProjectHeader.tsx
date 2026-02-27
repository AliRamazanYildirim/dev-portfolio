import React from "react";
import type { ProjectDetail } from "../types";

interface Props {
  project: ProjectDetail;
  projectTexts: any;
}

export default function ProjectHeader({ project, projectTexts }: Props) {
  return (
    <div className="mb-10">
      <h1 className="heading md:text-lgHeading mb-4">{project.title}</h1>
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
