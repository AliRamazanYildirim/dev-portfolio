"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SplitText from "@/TextAnimations/SplitText";
import { ProjectsAPI } from "@/lib/api";
import { projects as seedProjects } from "@/data/projects";

// TypeScript Interface für kleine Projekte
interface LittleProject {
  slug: string;
  title: string;
  mainImage: string;
  featured: boolean;
}

const ProjectsUI = () => {
  // State für Projekte und Loading
  const [projects, setProjects] = useState<LittleProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Alle Seed-Projekte + die ersten 2 Projekte aus der API laden
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Immer die ersten 2 Projekte aus der API laden (ohne Featured-Sonderfall)
        let dbItems: LittleProject[] = [];
        const allResponse = await ProjectsAPI.getAll({ limit: 2 });
        if (allResponse.success && Array.isArray(allResponse.data)) {
          dbItems = allResponse.data.slice(0, 2);
        }

        // Immer alle Seed-Projekte zusätzlich einblenden
        const seedItems: LittleProject[] = seedProjects.map((p: any) => ({
          slug: p.slug,
          title: p.title,
          mainImage: p.mainImage,
          featured: Boolean((p as any).featured),
        }));

        // Seeds zuerst, danach DB; Duplikate per slug entfernen
        const combined = [...seedItems, ...dbItems].reduce<LittleProject[]>(
          (acc, curr) => {
            if (!acc.find((x) => x.slug === curr.slug)) acc.push(curr);
            return acc;
          },
          []
        );

        setProjects(combined);
      } catch (err) {
        console.error("Fehler beim Laden der kleinen Projekte:", err);
        // Bei Fehler: Nur Seed-Daten anzeigen (alle Seeds)
        const seedOnly = seedProjects.map((p: any) => ({
          slug: p.slug,
          title: p.title,
          mainImage: p.mainImage,
          featured: Boolean((p as any).featured),
        }));
        setProjects(seedOnly);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Loading State
  if (loading) {
    return (
      <section className="text-white px-7 py-12 md:py-44">
        <div className="container mx-auto">
          <SplitText
            text="MY PROJECTS"
            className="title md:text-lgHeading font-bold mb-10"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-700 rounded-md h-64 mb-4"></div>
                <div className="bg-gray-700 rounded h-6 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="text-white px-7 py-12 md:py-44">
      <div className="container mx-auto">
        <SplitText
          text="MY PROJECTS"
          className="title md:text-lgHeading font-bold mb-10"
        />

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <Link href={`/projects/${project.slug}`} key={project.slug}>
                <div className="relative group">
                  <div className="relative w-full max-w-[900px] aspect-[3/2] rounded-md overflow-hidden">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      fill
                      className="w-full h-full transition-transform duration-300 group-hover:scale-90"
                      sizes="(max-width: 900px) 100vw, 900px"
                      priority
                    />
                  </div>

                  {/* Hover Overlay mit Projekttitel */}
                  <div className="absolute inset-0 bg-white bg-opacity-10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                    <p className="text-heading font-bold">{project.title}</p>
                    {project.featured && (
                      <p className="text-sm text-[#c9184a] font-medium">
                        Featured Project
                      </p>
                    )}
                  </div>

                  {/* Projekt Nummer */}
                  <div className="absolute top-4 left-4">
                    <p className="text-white text-heading font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
              <div className="bg-[#eeede9] rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-8 sm:p-12 max-w-sm sm:max-w-md mx-auto">
                <svg
                  className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-[#131313]/50 mb-4 sm:mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0122 34c4.09 0 7.691 2.462 9.287 6M6 16a6 6 0 0112 0v3.586l.707.707c.63.63.293 1.707-.707 1.707H6z"
                  />
                </svg>
                <h3 className="text-lg sm:text-xl font-medium text-[#131313] mb-2 sm:mb-3">
                  No projects yet
                </h3>
                <p className="text-sm sm:text-base text-[#131313]/70">
                  Click the button above to add your first project.
                </p>
              </div>
            </div>
        )}

        {/* Link zu allen Projekten */}
        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-block button md:text-lgButton border border-white px-8 py-3 rounded hover:bg-white hover:text-black transition"
          >
            Show all projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsUI;
