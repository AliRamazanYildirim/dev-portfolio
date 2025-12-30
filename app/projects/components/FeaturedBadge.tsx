import React from "react";

interface Props {
  label?: string;
}

export default function FeaturedBadge({ label = "Featured" }: Props) {
  return (
    <div className="absolute top-4 right-4 bg-[#c9184a] text-white px-3 py-1 rounded-full text-sm font-bold">
      {label}
    </div>
  );
}
