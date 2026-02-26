"use client";

import React from "react";
import MarqueeItem from "./MarqueeItem";

const Marquee = () => {
  const upperMarquee = [
    { src: "/techStack/javascript.svg", text: "JavaScript" },
    { src: "/techStack/tailwindcss.svg", text: "Tailwind" },
    { src: "/techStack/typescript.svg", text: "TypeScript" },
    { src: "/techStack/supabase.svg", text: "Supabase" },
    { src: "/techStack/postgresql.svg", text: "PostgreSQL" },
    { src: "/techStack/mongodb.svg", text: "MongoDB" },
    { src: "/techStack/prisma.svg", text: "Prisma" },
    { src: "/techStack/redis.svg", text: "Redis" },
    { src: "/techStack/nodejs.svg", text: "Node.js" },
    { src: "/techStack/csharp.svg", text: "C#" },
    { src: "/techStack/dotnet.svg", text: ".NET" },
    { src: "/techStack/expressjs.svg", text: "Express.js" },
    { src: "/techStack/nextjs.svg", text: "Next.Js" },
    { src: "/techStack/react.svg", text: "React" },
  ];

  const lowerMarquee = [
    { src: "/techStack/git.svg", text: "Git" },
    { src: "/techStack/github.svg", text: "GitHub" },
    { src: "/techStack/vscode.svg", text: "VS Code" },
    { src: "/techStack/postman.svg", text: "Postman" },
    { src: "/techStack/docker.svg", text: "Docker" },
    { src: "/techStack/bun.svg", text: "Bun" },
    { src: "/techStack/figma.svg", text: "Figma" },
    { src: "/techStack/vercel.svg", text: "Vercel" },
    { src: "/techStack/netlify.svg", text: "Netlify" }
  ];

  return (
    <div className="container mx-auto md:px-28">
      <MarqueeItem images={upperMarquee} from={"0%"} to={"-100%"} />
      <MarqueeItem images={lowerMarquee} from={"-100%"} to={"0%"} />
    </div>
  );
};

export default Marquee;
