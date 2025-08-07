// Skript zur Aktualisierung der Navigation-Felder - Script to update navigation fields
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateNavigation() {
  // Alle Projekte nach Erstellungsdatum sortieren (alt → neu) - Sort all projects by creation date (old → new)
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });

  console.log("Found projects:");
  projects.forEach((p, i) =>
    console.log(`${i + 1}. ${p.slug} (${p.createdAt})`)
  );

  // Navigation-Verknüpfungen aktualisieren - Update navigation links
  for (let i = 0; i < projects.length; i++) {
    const current = projects[i];
    const previous = i > 0 ? projects[i - 1] : null;
    const next = i < projects.length - 1 ? projects[i + 1] : null;

    await prisma.project.update({
      where: { id: current.id },
      data: {
        previousSlug: previous?.slug || null,
        nextSlug: next?.slug || null,
      },
    });

    console.log(
      `${current.slug}: previous=${previous?.slug || "null"}, next=${
        next?.slug || "null"
      }`
    );
  }

  console.log("Navigation updated!");
  await prisma.$disconnect();
}

updateNavigation().catch(console.error);
