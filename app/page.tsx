"use client";

import Hero from "@/components/sections/Hero";
import LittleAboutMe from "@/components/sections/LittleAboutMe";
import LittleProjects from "@/components/sections/LittleProjects";
import PartnersMarquee from "@/components/sections/PartnersMarquee";
import GoogleRatings from "@/components/sections/GoogleRatings";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <LittleAboutMe />
      <LittleProjects />
      <PartnersMarquee />
      <GoogleRatings />
    </main>
  );
}
