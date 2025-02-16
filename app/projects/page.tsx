"use client";

import { projects } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import NoiseBackground from "@/components/NoiseBackground";
import SplitText from "@/TextAnimations/SplitText";

const ProjectsPage = () => {
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

  return (
    <NoiseBackground mode="dark" intensity={0.1}>
      <motion.section
        className="text-white px-5 pb-10 md:px-20 md:pb-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <SplitText text="Projects" className="title md:text-lgTitle mb-10" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {projects.map((project, index) => (
              <Link href={`/projects/${project.slug}`} key={index}>
                <div className="relative group">
                  {/* Bild-Container mit subtilerem Blur */}
                  <div className="overflow-hidden rounded-md w-full h-[400px] relative bg-white/5 backdrop-blur-[1px] border border-white/10">
                    <div className="w-full h-full flex items-center justify-center p-6">
                      <Image
                        src={project.mainImage}
                        alt={project.title}
                        width={1920}
                        height={1080}
                        className="object-contain max-h-[300px] transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Titel und Beschreibung unter dem Bild */}
                  <div className="mt-4">
                    <h2 className="text-white text-heading font-bold">
                      {project.title}
                    </h2>
                    <p className="text-gray-300 text-sm mt-2">
                      {project.description.slice(0, 100)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </NoiseBackground>
  );
};

export default ProjectsPage;
