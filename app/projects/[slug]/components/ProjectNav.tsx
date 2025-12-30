import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  previousSlug?: string | null;
  nextSlug?: string | null;
  projectTexts: any;
}

export default function ProjectNav({
  previousSlug,
  nextSlug,
  projectTexts,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center border-t border-gray-700 pt-8">
      <button
        onClick={() =>
          previousSlug
            ? router.push(`/projects/${previousSlug}`)
            : router.push("/projects")
        }
        className="text-white hover:text-[#c9184a] heading md:text-lgHeading font-bold transition flex items-center gap-2"
      >
        <span>&lt;</span>
        {previousSlug ? projectTexts.previous : projectTexts.indexFallback}
      </button>

      <button
        onClick={() =>
          nextSlug
            ? router.push(`/projects/${nextSlug}`)
            : router.push("/projects")
        }
        className="text-white hover:text-[#c9184a] heading md:text-lgHeading font-bold transition flex items-center gap-2"
      >
        {nextSlug ? projectTexts.next : projectTexts.indexFallback}
        <span>&gt;</span>
      </button>
    </div>
  );
}
