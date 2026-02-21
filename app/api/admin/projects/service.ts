/**
 * Admin Projects API – Business Logic / Service Layer
 *
 * Encapsulates all project CRUD operations used by admin route handlers.
 * Route handlers must NOT access Models directly – only this service.
 */

import {
    projectRepository,
    projectImageRepository,
} from "@/lib/repositories";
import { ValidationError, NotFoundError, AppError } from "@/lib/errors";
import type { UpdateProjectInput, UpdateProjectResult, DeleteProjectResult } from "./types";

export class AdminProjectsService {
    /**
     * Projekt aktualisieren (Admin)
     */
    static async update(id: string, input: UpdateProjectInput) {
        const {
            slug,
            title,
            description,
            role,
            duration,
            category,
            technologies,
            mainImage,
            gallery = [],
            featured = false,
            previousSlug,
            nextSlug,
        } = input;

        // Validierung erfolgt bereits in validation.ts → route.ts prüft vor Service-Aufruf

        const existingProject = await projectRepository.findUnique({ where: { id } });
        if (!existingProject) {
            throw new NotFoundError(`Project not found with ID: ${id}`);
        }

        // Slug-Eindeutigkeit prüfen bei Änderung
        if (slug !== (existingProject as any).slug) {
            const slugExists = await projectRepository.findUnique({ where: { slug } });
            if (slugExists && String((slugExists as any)._id ?? (slugExists as any).id) !== id) {
                throw new ValidationError("A project with this slug already exists");
            }
        }

        const updateData = {
            slug,
            title,
            description,
            role,
            duration,
            category,
            technologies,
            mainImage,
            featured,
            previousSlug: previousSlug || null,
            nextSlug: nextSlug || null,
            updatedAt: new Date(),
        };

        // Galerie aktualisieren
        let galleryUpdateError: string | null = null;
        try {
            await projectImageRepository.deleteMany({ where: { projectId: id } });

            if (gallery && gallery.length > 0) {
                const galleryData = gallery.map((url: string, index: number) => ({
                    projectId: id,
                    url,
                    publicId: `portfolio_${slug}_${index}_${Date.now()}`,
                    alt: `${title} screenshot ${index + 1}`,
                    order: index,
                }));
                await projectImageRepository.createMany({ data: galleryData });
            }
        } catch (galleryError: any) {
            console.error("Gallery update error:", galleryError);
            galleryUpdateError = galleryError.message;
        }

        const updatedProject = await projectRepository.update({
            where: { id },
            data: updateData,
        });

        if (!updatedProject) {
            throw new AppError("Failed to update project", 500);
        }

        const galleryRes = await projectImageRepository.findMany({
            where: { projectId: id },
            orderBy: { order: "asc" },
        });

        return {
            data: { ...updatedProject, gallery: galleryRes },
            message: "Project updated successfully",
            ...(galleryUpdateError && { galleryWarning: galleryUpdateError }),
        };
    }

    /**
     * Projekt löschen (Admin)
     */
    static async delete(id: string) {
        const existing = await projectRepository.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundError(`Project not found with ID: ${id}`);
        }

        // Zuerst Galerie-Bilder löschen
        const deleteImagesResult = await projectImageRepository.deleteMany({ where: { projectId: id } });
        const deletedCount = (deleteImagesResult as any)?.deletedCount ?? 0;

        // Dann das Projekt löschen
        const deleteResult = await projectRepository.delete({ where: { id } });
        if (!deleteResult) {
            throw new AppError("Failed to delete project", 500);
        }

        return {
            message: "Project deleted successfully",
            deletedImages: deletedCount,
        };
    }
}
