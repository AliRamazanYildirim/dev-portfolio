import { db } from "../lib/db";

async function main() {
    const hash = process.argv[2];
    const email = process.env.ADMIN_EMAIL || "aliramazanyildirim@proton.me";

    if (!hash) {
        console.log("Usage: bun run scripts/update-admin-password.ts '<bcrypt-hash>'");
        process.exit(1);
    }

    try {
        const upserted = await db.adminUser.upsert({
            where: { email },
            update: {
                password: hash,
                active: true,
            },
            create: {
                email,
                name: "Admin",
                password: hash,
                active: true,
            },
        });

        console.log("✅ Admin user updated/created:", upserted.email, upserted.id);
    } catch (error) {
        console.error("❌ Error updating admin user:", error);
        process.exit(2);
    } finally {
        await db.$disconnect();
    }
}

main();
