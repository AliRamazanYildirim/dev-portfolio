"use client";

import NoiseBackground from "@/components/NoiseBackground";

export default function CheckingSessionScreen({
  message = "Checking session...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen w-full">
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white text-lg">{message}</p>
          </div>
        </div>
      </NoiseBackground>
    </div>
  );
}
