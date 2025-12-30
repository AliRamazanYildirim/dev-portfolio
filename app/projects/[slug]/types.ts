export interface ProjectImage {
    id?: string;
    url: string;
    alt?: string;
    order: number;
}

export interface ProjectTag {
    id: string;
    name: string;
    color: string;
}

export interface ProjectDetail {
    id: string;
    slug: string;
    title: string;
    author: string;
    description: { en: string; de: string; tr: string } | string;
    role: string;
    duration: string;
    category: string;
    technologies: string[] | string;
    mainImage: string;
    featured: boolean;
    previousSlug: string | null;
    nextSlug: string | null;
    gallery: ProjectImage[];
    tags: ProjectTag[];
    createdAt: string;
    updatedAt: string;
}
