"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import SplitText from "@/TextAnimations/SplitText";

const projects = [
  {
    number: "01",
    name: "Todo Spark App",
    image: "/projects/project1.1.png",
    link: "/projects/discover-project",
  },
  {
    number: "02",
    name: "Discover Go App",
    image: "/projects/project2.1.png",
    link: "/projects/todo-project",
  },
];

const ProjectsUI = () => {
  return (
    <section className="text-white px-7 py-12 md:py-44">
      <div className="container mx-auto">
        <SplitText
          text="MY PROJECTS"
          className="title md:text-lgHeading font-bold mb-10"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <Link href={project.link} key={index}>
              <div className="relative group">
                {/* Fester Rahmen mit definierter Höhe und Blur-Effekt */}
                <div className="overflow-hidden rounded-md w-full h-[400px] relative bg-white/5 backdrop-blur-[1px] border border-white/10">
                  {/* Nummer oben links */}
                  <div className="absolute top-1 left-1 z-10">
                    <p className="text-white text-heading font-bold">
                      {project.number}
                    </p>
                  </div>

                  {/* Bild in der Mitte */}
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={1920}
                      height={1080}
                      className="object-contain max-h-[300px] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Name unten */}
                  <div className="absolute bottom-1 left-1 right-1 z-10">
                    <p className="text-white text-heading font-bold">
                      {project.name}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsUI;
