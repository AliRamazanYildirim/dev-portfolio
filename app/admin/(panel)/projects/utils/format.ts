import { INVOICE_CONSTANTS } from "@/constants/invoice";
import type { Project, ProjectApiResponse, ProjectDescription } from "../types";

const FALLBACK_DURATION = INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION[0];
const FALLBACK_DESCRIPTION = "No description available";

const clampDescription = (value: string) =>
  value.length > 150 ? `${value.substring(0, 150)}...` : value;

const parseTechStack = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string");
      }
    } catch (error) {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
    return [];
  }
  return [];
};

const parseDescription = (description?: ProjectDescription | string | null) => {
  if (!description) {
    return { object: FALLBACK_DESCRIPTION, summary: FALLBACK_DESCRIPTION };
  }

  if (typeof description === "string") {
    return {
      object: description,
      summary: description || FALLBACK_DESCRIPTION,
    };
  }

  const summary =
    description.en || description.de || description.tr || FALLBACK_DESCRIPTION;

  return { object: description, summary };
};

export const mapApiProject = (project: ProjectApiResponse): Project => {
  const { object: descriptionObj, summary } = parseDescription(
    project.description,
  );

  return {
    id: project.id || project._id || String(project._id ?? crypto.randomUUID()),
    title: project.title || "Untitled",
    description: descriptionObj,
    shortDescription: clampDescription(summary),
    techStack: parseTechStack(project.technologies),
    category: project.category || "",
    duration: project.duration || FALLBACK_DURATION,
    isFeatured: Boolean(project.featured),
    gallery: Array.isArray(project.gallery) ? project.gallery : [],
    createdAt: project.createdAt
      ? new Date(project.createdAt).toISOString()
      : project.created_at
        ? new Date(project.created_at).toISOString()
        : new Date().toISOString(),
  };
};

export const getDescriptionText = (
  description?: ProjectDescription | string | null,
): string => {
  if (!description) return "";
  if (typeof description === "string") return description;
  if (typeof description === "object") {
    return description.en || description.de || description.tr || "";
  }
  return String(description);
};

export const formatCreatedDate = (isoDate?: string) => {
  if (!isoDate) return "Created: Unknown";
  try {
    const formatted = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(isoDate));
    return `Created: ${formatted}`;
  } catch (error) {
    return "Created: Unknown";
  }
};

export const formatStatsText = (
  filteredCount: number,
  totalCount: number,
  range: { start: number; end: number; total: number },
): string => {
  if (filteredCount === 0) {
    return totalCount === 0
      ? "No projects yet"
      : "No projects match your current search or filter";
  }

  return `Showing ${range.start} - ${range.end} of ${range.total}`;
};

export const formatTotalLabel = (
  filteredCount: number,
  totalCount: number,
): string => {
  if (filteredCount === totalCount) return `Projects (${totalCount})`;
  return `Projects (${filteredCount} / ${totalCount})`;
};
