"use client";

import dynamic from "next/dynamic";

const ProjectDashboard = dynamic(() => import("./projects/ProjectDashboard"), {
  ssr: false,
});

export default function AdminProjectsPage() {
  return <ProjectDashboard />;
}
