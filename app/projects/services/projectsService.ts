import { ProjectsAPI } from "@/lib/api";

export async function getAllProjects() {
  return await ProjectsAPI.getAll();
}

export async function getProjectBySlug(slug: string) {
  return await ProjectsAPI.getBySlug(slug);
}

const projectsService = { getAllProjects, getProjectBySlug };
export default projectsService;
