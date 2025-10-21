import { connectToMongo } from "../lib/mongodb";
import ProjectModel from "../models/Project";

async function migrateDescriptions() {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await connectToMongo();

        console.log("📊 Finding projects with old description format...");
        const projects = await ProjectModel.find({}).exec();

        let migrated = 0;
        let skipped = 0;

        for (const project of projects) {
            // Check if description is already an object
            if (typeof project.description === "object") {
                console.log(`⏭️  Skipping "${project.title}" - already migrated`);
                skipped++;
                continue;
            }

            // Convert string to multilingual object
            const oldDescription = project.description as string;
            const newDescription = {
                en: oldDescription,
                de: "",
                tr: "",
            };

            await ProjectModel.findByIdAndUpdate(project._id, {
                description: newDescription,
            }).exec();

            console.log(`✅ Migrated "${project.title}"`);
            migrated++;
        }

        console.log("\n📈 Migration Summary:");
        console.log(`   ✅ Migrated: ${migrated}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   📊 Total: ${projects.length}`);
        console.log("\n✨ Migration completed!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrateDescriptions();
