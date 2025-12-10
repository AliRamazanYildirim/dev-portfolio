export interface ProjectDescription {
  en?: string;
  de?: string;
  tr?: string;
  [key: string]: string | undefined;
}

export interface ProjectGalleryItem {
  url: string;
}

export interface ProjectApiResponse {
  id?: string;
  _id?: string;
  title?: string;
  description?: ProjectDescription | string | null;
  shortDescription?: string;
  technologies?: string | string[];
  category?: string;
  duration?: string;
  featured?: boolean;
  gallery?: ProjectGalleryItem[];
  createdAt?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: ProjectDescription | string;
  shortDescription: string | ProjectDescription;
  techStack: string[];
  isFeatured: boolean;
  category?: string;
  duration?: string;
  gallery: ProjectGalleryItem[];
  createdAt?: string;
}

export type ProjectSortOption =
  | "none"
  | "name_asc"
  | "name_desc"
  | "created_asc"
  | "created_desc";
