"use client";

import { useEffect, useState } from "react";
import { ProjectsAPI } from "@/lib/api";
import type { ProjectDetail } from "../types";

interface ProjectResult {
    project: ProjectDetail | null;
    loading: boolean;
    error: string | null;
}

export function useProject(slug?: string | null): ProjectResult {
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        let mounted = true;
        const controller = new AbortController();

        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await ProjectsAPI.getBySlug(slug);
                if (!mounted) return;
                if (response?.success) {
                    setProject(response.data || null);
                    setError(null);
                } else {
                    setProject(null);
                    setError(response?.error || "Not found");
                }
            } catch (err) {
                if ((err as any)?.name === "AbortError") return;
                setError("Connection error");
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProject();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [slug]);

    return { project, loading, error };
}
