import React from "react";
import type { ProjectDetail } from "../types";

interface Props {
  project: ProjectDetail;
  projectTexts: any;
  description: string;
}

export default function ProjectMeta({
  project,
  projectTexts,
  description,
}: Props) {
  return (
    <div className="mb-16 grid grid-cols-1 md:grid-cols-2 md:gap-8">
      <div>
        <h2 className="heading md:text-lgHeading font-bold mb-4">
          {projectTexts.aboutHeading}
        </h2>
      </div>
      <div>
        <p className="content md:text-lgContent text-white text-lg leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div>
          <p className="font-bold content md:text-lgContent text-white">
            {projectTexts.role}
          </p>
          <p className="text-white">{project.role}</p>
        </div>
        <div>
          <p className="font-bold content md:text-lgContent text-white">
            {projectTexts.duration}
          </p>
          <p className="text-white">{project.duration}</p>
        </div>
        <div>
          <p className="font-bold content md:text-lgContent text-white">
            {projectTexts.category}
          </p>
          <p className="text-white">{project.category}</p>
        </div>
      </div>
    </div>
  );
}
