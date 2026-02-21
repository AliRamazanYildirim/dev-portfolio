import React from "react";

interface Props {
  text?: string;
}

export default function ProjectLoadingState({ text = "Loading..." }: Props) {
  return (
    <div className="text-white px-5 pb-10 md:px-20 md:pb-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="content md:text-lgContent">{text}</p>
      </div>
    </div>
  );
}
