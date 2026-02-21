import type { Project, ProjectApiResponse } from "../types";
import { mapApiProject } from "../utils/format";

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function fetchProjects(): Promise<ApiResult<Project[]>> {
  try {
    const res = await fetch("/api/projects");
    const json = await safeJson(res);
    if (!res.ok || !json) {
      return { success: false, error: json?.error || `HTTP ${res.status}` };
    }

    const data: ProjectApiResponse[] = Array.isArray(json.data)
      ? json.data
      : [];
    const projects = data.map(mapApiProject);
    return { success: true, data: projects };
  } catch (err) {
    return { success: false, error: (err as Error).message || "Fetch failed" };
  }
}

export async function createProject(
  payload: Record<string, unknown>,
): Promise<ApiResult<Project>> {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await safeJson(res);
    if (!res.ok || !json || !json.success) {
      return { success: false, error: json?.error || `HTTP ${res.status}` };
    }
    const project = mapApiProject(json.data as ProjectApiResponse);
    return { success: true, data: project };
  } catch (err) {
    return { success: false, error: (err as Error).message || "Create failed" };
  }
}

export async function updateProject(
  id: string,
  payload: Record<string, unknown>,
): Promise<ApiResult<Project>> {
  try {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await safeJson(res);
    if (!res.ok || !json || !json.success) {
      return { success: false, error: json?.error || `HTTP ${res.status}` };
    }
    const project = mapApiProject(json.data as ProjectApiResponse);
    return { success: true, data: project };
  } catch (err) {
    return { success: false, error: (err as Error).message || "Update failed" };
  }
}

export async function deleteProject(id: string): Promise<ApiResult<null>> {
  try {
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    const json = await safeJson(res);
    if (!res.ok || !json || !json.success) {
      return { success: false, error: json?.error || `HTTP ${res.status}` };
    }
    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: (err as Error).message || "Delete failed" };
  }
}

const projectsApi = {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
};
export default projectsApi;
