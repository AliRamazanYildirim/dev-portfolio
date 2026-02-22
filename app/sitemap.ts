import type { MetadataRoute } from "next";
import { connectToMongo } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import { solutionSlugs } from "@/constants/solutionsContent";

const BASE_URL = "https://www.arytechsolutions.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    /* ─── Static pages ─── */
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/solutions`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/impressum`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    /* ─── Dynamic: Solution pages ─── */
    const solutionRoutes: MetadataRoute.Sitemap = solutionSlugs.map((slug) => ({
        url: `${BASE_URL}/solutions/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    /* ─── Dynamic: Project pages (from DB) ─── */
    let projectRoutes: MetadataRoute.Sitemap = [];
    try {
        await connectToMongo();
        const projects = await ProjectModel.find({ published: true })
            .select("slug updatedAt")
            .lean()
            .exec();

        projectRoutes = projects.map((project) => ({
            url: `${BASE_URL}/projects/${project.slug}`,
            lastModified: project.updatedAt
                ? new Date(project.updatedAt as string | number | Date)
                : new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        }));
    } catch {
        // If DB is unavailable, sitemap still works with static routes
        console.warn("[sitemap] Could not fetch projects from DB");
    }

    return [...staticRoutes, ...solutionRoutes, ...projectRoutes];
}
