import { connectToMongo } from "../lib/mongodb";
import AdminModel from "../models/Admin";

async function main() {
    const hash = process.argv[2];
    const email = process.env.ADMIN_EMAIL || "aliramazanyildirim@proton.me";

    if (!hash) {
        console.log("Usage: bun run scripts/update-admin-password.ts '<bcrypt-hash>'");
        process.exit(1);
    }

    try {
        await connectToMongo();

        const updated = await AdminModel.findOneAndUpdate(
            { email },
            { password: hash, active: true, name: "Admin" },
            { upsert: true, new: true }
        ).exec();

        console.log("✅ Admin user updated/created:", updated?.email, updated?._id?.toString());
    } catch (error) {
        console.error("❌ Error updating admin user:", error);
        process.exit(2);
    } finally {
        await (await connectToMongo()).close();
    }
}

main();
