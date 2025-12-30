import React from "react";

interface Props {
  name: string;
  color?: string;
}

export default function Tag({ name, color = "#999" }: Props) {
  const bg = color + "20";
  return (
    <span
      className="px-4 py-2 rounded-full text-sm font-medium"
      style={{
        backgroundColor: bg,
        borderColor: color,
        color: color,
        border: `1px solid ${color}`,
      }}
    >
      {name}
    </span>
  );
}
