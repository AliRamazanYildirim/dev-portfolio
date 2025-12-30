"use client";

import { useEffect, useState } from "react";
import projectsService from "../services/projectsService";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: any;
  mainImage: string;
  featured?: boolean;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsService.getAllProjects();
        if (!mounted) return;
        if (response?.success) {
          setProjects(response.data || []);
        } else {
          setError(response?.error || "Error loading projects");
        }
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError("Connection error");
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return { projects, loading, error };
}
