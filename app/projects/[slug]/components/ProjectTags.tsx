import React from "react";
import type { ProjectTag } from "../types";

interface Props {
  tags: ProjectTag[];
}

export default function ProjectTags({ tags }: Props) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mb-16">
      <h2 className="heading md:text-lgHeading mb-4">Tags</h2>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: tag.color + "20",
              borderColor: tag.color,
              color: tag.color,
              border: `1px solid ${tag.color}`,
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
