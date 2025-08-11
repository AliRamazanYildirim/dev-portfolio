"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import NoiseBackground from "@/components/NoiseBackground";
import SplitText from "@/TextAnimations/SplitText";
import { ProjectsAPI } from "@/lib/api";

// TypeScript Interface für Projekte
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  mainImage: string;
  featured: boolean;
  gallery: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
}

const ProjectsPage = () => {
  // State für Projekte und Loading
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Projekte von der API laden
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await ProjectsAPI.getAll();

        if (response.success) {
          setProjects(response.data);
        } else {
          setError(response.error || "Fehler beim Laden der Projekte");
        }
      } catch (err) {
        setError("Verbindungsfehler beim Laden der Projekte");
        console.error("Fehler beim Laden der Projekte:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // Loading State
  if (loading) {
    return (
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="text-white px-5 pb-10 md:px-20 md:pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="content md:text-lgContent">
              Projekte werden geladen...
            </p>
          </div>
        </div>
      </NoiseBackground>
    );
  }

  // Error State
  if (error) {
    return (
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="text-white px-5 pb-10 md:px-20 md:pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="content md:text-lgContent text-red-400 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="button md:text-lgButton border border-white px-6 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </NoiseBackground>
    );
  }

  return (
    <NoiseBackground mode="dark" intensity={0.1}>
      <motion.section
        className="text-white px-5 pb-10 md:px-20 md:pb-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto">
          {/* Header mit Projektanzahl */}
          <div className="mb-10">
            <SplitText text="Projects" className="title md:text-lgTitle mb-4" />
            <p className="content md:text-lgContent text-gray">
              {projects.length} {projects.length === 1 ? "Projekt" : "Projekte"}{" "}
              gefunden
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {projects.map((project) => (
              <motion.div
                key={project.slug}
                className="cursor-pointer group"
                variants={itemVariants}
              >
                <Link href={`/projects/${project.slug}`}>
                  <div className="relative overflow-hidden rounded-md">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      width={1920}
                      height={1080}
                      className="w-full rounded-md hover:scale-105 transition-transform duration-300"
                    />
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-[#c9184a] text-white px-3 py-1 rounded-full text-sm font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="content md:text-lgContent font-bold group-hover:text-[#c9184a] transition">
                      {project.title}
                    </h2>
                    <p className="button md:text-lgButton text-white mt-2 line-clamp-2">
                      {project.description.length > 100
                        ? `${project.description.slice(0, 100)}...`
                        : project.description}
                    </p>
                    {/* Galerie Anzahl */}
                    <p className="text-sm text-white mt-2">
                      {project.gallery.length} Bilder
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Keine Projekte gefunden */}
          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="content md:text-lgContent text-gray mb-4">
                Keine Projekte gefunden.
              </p>
              <p className="button md:text-lgButton text-gray">
                Schauen Sie später wieder vorbei!
              </p>
            </div>
          )}
        </div>
      </motion.section>
    </NoiseBackground>
  );
};

export default ProjectsPage;
