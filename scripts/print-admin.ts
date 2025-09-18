import { connectToMongo } from "../lib/mongodb";
import AdminModel from "../models/Admin";

async function printAdmin() {
    try {
        console.log("🔍 Connecting to MongoDB and fetching admin...");
        const conn = await connectToMongo();

        const admin = await AdminModel.findOne({}).lean().exec();
        if (!admin) {
            console.log("⚠️  No admin document found in the database.");
            return;
        }

        const adminId = admin._id ? String(admin._id) : (admin as any).id ?? "<no-id>";

        console.log("✅ Admin found:");
        console.log(`  email: ${admin.email}`);
        console.log(`  id: ${adminId}`);
        console.log(`  password (hash): ${admin.password}`);
        console.log(`  active: ${admin.active}`);
    } catch (err) {
        console.error("❌ Error reading admin:", err);
    } finally {
        try {
            // close connection if possible
            const conn = await connectToMongo();
            await conn.close();
        } catch (e) {
            // ignore
        }
    }
}

if (require.main === module) {
    printAdmin();
}
