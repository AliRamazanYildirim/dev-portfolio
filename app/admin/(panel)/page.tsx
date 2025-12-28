"use client";

import dynamic from "next/dynamic";

const ProjectDashboard = dynamic(
  () => import("./projects/ProjectDashboard").then((mod) => mod.default),
  { ssr: false },
);

export default function AdminProjectsPage() {
  return <ProjectDashboard />;
}
