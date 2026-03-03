import React from "react";
import { NAV_HEIGHT } from "@/components/ui/nav/shared";

interface Props {
  text?: string;
}

const centeredViewportStyle = {
  minHeight: `calc(100dvh - ${NAV_HEIGHT})`,
};

export default function ProjectLoadingState({ text = "Loading..." }: Props) {
  return (
    <div
      className="text-zinc-900 dark:text-white px-5 md:px-20 flex items-center justify-center"
      style={centeredViewportStyle}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c58d12] mx-auto mb-4"></div>
        <p className="content md:text-lgContent">{text}</p>
      </div>
    </div>
  );
}
