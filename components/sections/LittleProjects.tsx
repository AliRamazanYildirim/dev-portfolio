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
        <SplitText text="MY PROJECTS" className="title md:text-lgHeading font-bold mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <Link href={project.link} key={index}>
              <div className="relative group">
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={1920}
                    height={1080}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-heading font-bold">{project.name}</p>
                </div>

                <div className="absolute top-4 left-4">
                  <p className="text-white text-heading font-bold">{project.number}</p>
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
