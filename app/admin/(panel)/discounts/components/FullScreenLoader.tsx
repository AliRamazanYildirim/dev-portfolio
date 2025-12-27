"use client";

import NoiseBackground from "@/components/NoiseBackground";

export default function FullScreenLoader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 w-full h-full">
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="relative z-10 flex items-center justify-center min-h-screen w-full h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white text-lg">{message}</p>
          </div>
        </div>
      </NoiseBackground>
    </div>
  );
}
