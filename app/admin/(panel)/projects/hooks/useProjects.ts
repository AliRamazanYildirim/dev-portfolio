"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project } from "../types";
import * as projectsApi from "../services/projectsApi";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const result = await projectsApi.fetchProjects();
    if (result.success) {
      setProjects(result.data);
    } else {
      setProjects([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(
    async (payload: Record<string, unknown>) => {
      setLoading(true);
      const result = await projectsApi.createProject(payload);
      if (result.success) {
        setProjects((prev) => [result.data, ...prev]);
      }
      setLoading(false);
      return result;
    },
    [],
  );

  const updateProject = useCallback(
    async (id: string, payload: Record<string, unknown>) => {
      setLoading(true);
      const result = await projectsApi.updateProject(id, payload);
      if (result.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === result.data.id ? result.data : p)),
        );
      }
      setLoading(false);
      return result;
    },
    [],
  );

  const deleteProject = useCallback(async (id: string) => {
    setLoading(true);
    const result = await projectsApi.deleteProject(id);
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    setLoading(false);
    return result;
  }, []);

  const refresh = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    refresh,
    setProjects,
  } as const;
}

export default useProjects;
