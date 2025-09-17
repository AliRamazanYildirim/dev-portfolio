// Skript zur Aktualisierung der Navigation-Felder - Script to update navigation fields
import { connectToMongo } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";

async function updateNavigation() {
  await connectToMongo();

  // Alle Projekte nach Erstellungsdatum sortieren (alt → neu)
  const projects = await ProjectModel.find({ published: true })
    .sort({ createdAt: 1 })
    .lean()
    .exec();

  console.log("Found projects:");
  projects.forEach((p, i) =>
    console.log(`${i + 1}. ${p.slug} (${p.createdAt})`)
  );

  for (let i = 0; i < projects.length; i++) {
    const current = projects[i];
    const previous = i > 0 ? projects[i - 1] : null;
    const next = i < projects.length - 1 ? projects[i + 1] : null;

    await ProjectModel.findByIdAndUpdate(current._id, {
      previousSlug: previous?.slug || null,
      nextSlug: next?.slug || null,
      updatedAt: new Date(),
    }).exec();

    console.log(
      `${current.slug}: previous=${previous?.slug || "null"}, next=${
        next?.slug || "null"
      }`
    );
  }

  console.log("Navigation updated!");
  // close connection
  const conn = await connectToMongo();
  if (conn && typeof conn.close === "function") await conn.close();
}

updateNavigation().catch(console.error);
