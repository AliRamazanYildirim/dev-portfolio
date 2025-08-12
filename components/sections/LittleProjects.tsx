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
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
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
          <div className="text-center py-20">
            <p className="content md:text-lgContent text-gray">
              Projects will be added soon. Check back later!
            </p>
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
