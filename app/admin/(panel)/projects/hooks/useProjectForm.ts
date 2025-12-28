"use client";

import { useCallback, useState } from "react";
import type { Project } from "../types";
import * as projectsApi from "../services/projectsApi";
import { makeSlug } from "../lib/slug";
import { notify } from "../lib/notify";

interface UseProjectFormOptions {
  onSaved?: (project: Project) => void;
}

export function useProjectForm(options?: UseProjectFormOptions) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionDE, setDescriptionDE] = useState("");
  const [descriptionTR, setDescriptionTR] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"en" | "de" | "tr">("en");

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDescriptionDE("");
    setDescriptionTR("");
    setShortDescription("");
    setTechStack("");
    setCategory("");
    setDuration("");
    setIsFeatured(false);
    setGallery([]);
    setEditingProject(null);
    setActiveTab("en");
    setShowForm(false);
  }, []);

  const openForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const openForEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setTitle(project.title || "");
    if (typeof project.description === "object") {
      setDescription(project.description.en || "");
      setDescriptionDE(project.description.de || "");
      setDescriptionTR(project.description.tr || "");
    } else {
      setDescription(project.description || "");
      setDescriptionDE("");
      setDescriptionTR("");
    }
    setShortDescription(
      typeof project.shortDescription === "string"
        ? project.shortDescription
        : "",
    );
    setTechStack(project.techStack.join(", "));
    setCategory(project.category || "");
    setDuration(project.duration || "");
    setIsFeatured(Boolean(project.isFeatured));
    setGallery(project.gallery.map((g) => g.url));
    setActiveTab("en");
    setShowForm(true);
  }, []);

  const addGalleryImage = useCallback((url: string) => {
    setGallery((prev) => [...prev, url]);
  }, []);

  const removeGalleryImage = useCallback((index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const validate = useCallback(() => {
    if (!title.trim()) return "Title is required";
    if (!description.trim()) return "Description is required";
    return null;
  }, [title, description]);

  const submit = useCallback(async () => {
    const validationError = validate();
    if (validationError) {
      notify.error(validationError);
      return { success: false, error: validationError } as const;
    }

    const slug = makeSlug(title || "untitled");

    const techArray = techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      slug,
      title,
      description: {
        en: description,
        de: descriptionDE,
        tr: descriptionTR,
      },
      role: "Full Stack Developer",
      duration,
      category,
      technologies: JSON.stringify(techArray),
      mainImage: gallery[0] || "/placeholder.jpg",
      gallery,
      featured: isFeatured,
      previousSlug: null,
      nextSlug: null,
    } as const;

    try {
      if (editingProject) {
        const result = await projectsApi.updateProject(
          editingProject.id,
          payload as unknown as Record<string, unknown>,
        );
        if (result.success) {
          notify.success("The project has been updated!");
          options?.onSaved?.(result.data);
          resetForm();
          return { success: true, data: result.data } as const;
        }
        notify.error(result.error);
        return { success: false, error: result.error } as const;
      } else {
        const result = await projectsApi.createProject(
          payload as unknown as Record<string, unknown>,
        );
        if (result.success) {
          notify.success("Project saved!");
          options?.onSaved?.(result.data);
          resetForm();
          return { success: true, data: result.data } as const;
        }
        notify.error(result.error);
        return { success: false, error: result.error } as const;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notify.error(message);
      return { success: false, error: message } as const;
    }
  }, [
    validate,
    title,
    description,
    descriptionDE,
    descriptionTR,
    techStack,
    duration,
    category,
    gallery,
    isFeatured,
    editingProject,
    options,
    resetForm,
  ]);

  return {
    // visibility
    showForm,
    openForm,
    resetForm,
    openForEdit,

    // editing
    editingProject,

    // values
    title,
    description,
    descriptionDE,
    descriptionTR,
    shortDescription,
    techStack,
    category,
    duration,
    isFeatured,
    gallery,
    activeTab,

    // setters
    setTitle,
    setDescription,
    setDescriptionDE,
    setDescriptionTR,
    setShortDescription,
    setTechStack,
    setCategory,
    setDuration,
    setIsFeatured,
    setActiveTab,
    addGalleryImage,
    removeGalleryImage,

    // actions
    submit,
  } as const;
}

export default useProjectForm;
