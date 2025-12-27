"use client";

import { useRouter } from "next/navigation";

export default function BackToHomeButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="text-center mt-8">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
      >
        {children}
      </button>
    </div>
  );
}
