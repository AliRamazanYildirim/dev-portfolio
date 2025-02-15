"use client";

import NoiseBackground from "@/components/NoiseBackground";

export default function Home() {
  return (
    <main className="relative flex justify-center items-center flex-col overflow-x-hidden mx-auto">
      <div className="w-full">
        <NoiseBackground mode="light" intensity={0.1}>

        </NoiseBackground>
      </div>
    </main>
  );
}
