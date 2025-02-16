"use client";

import React from "react";
import MarqueeItem from "./MarqueeItem";

const Marquee = () => {
  const upperMarquee = [
    { src: "/techStack/01.svg", text: "JavaScript" },
    { src: "/techStack/02.svg", text: "Tailwind" },
    { src: "/techStack/03.svg", text: "TypeScript" },
    { src: "/techStack/04.svg", text: "Supabase" },
    { src: "/techStack/05.svg", text: "PostgreSQL" },
    { src: "/techStack/06.svg", text: "Node.js" },
    { src: "/techStack/07.svg", text: "Express.js" },
    { src: "/techStack/08.svg", text: "Next.Js" },
    { src: "/techStack/09.svg", text: "React" },
  ];

  const lowerMarquee = [
    { src: "/techStack/10.svg", text: "Git" },
    { src: "/techStack/11.svg", text: "GitHub" },
    { src: "/techStack/12.svg", text: "VS Code" },
    { src: "/techStack/13.svg", text: "Postman" },
    { src: "/techStack/14.svg", text: "Docker" },
    { src: "/techStack/15.svg", text: "Bun" },
    { src: "/techStack/16.svg", text: "Figma" },
  ];

  return (
    <div className="container mx-auto md:px-28">
      <MarqueeItem images={upperMarquee} from={"0%"} to={"-100%"} />
      <MarqueeItem images={lowerMarquee} from={"-100%"} to={"0%"} />
    </div>
  );
};

export default Marquee;
