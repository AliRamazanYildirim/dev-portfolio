"use client";

import Hero from "@/components/sections/Hero";
import LittleAboutMe from "@/components/sections/LittleAboutMe";
import LittleProjects from "@/components/sections/LittleProjects";
import PartnersMarquee from "@/components/sections/PartnersMarquee";
import GoogleRatings from "@/components/sections/GoogleRatings";
import NoiseBackground from "@/components/ui/NoiseBackground";

export default function Home() {
  return (
    <main className="w-full">
      <div className="w-full">
        <NoiseBackground mode="light" intensity={0.1}>
          <Hero />
        </NoiseBackground>
        <NoiseBackground mode="dark" intensity={0.1}>
          <LittleAboutMe />
          <LittleProjects />
          <PartnersMarquee />
          <GoogleRatings />
        </NoiseBackground>
      </div>
    </main>
  );
}
