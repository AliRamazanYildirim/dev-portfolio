import { connectToMongo } from "../lib/mongodb";
import AdminModel from "../models/Admin";
import { hashPassword, ADMIN_CREDENTIALS } from "../lib/auth";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

/**
 * Admin-Benutzer in der Datenbank erstellen - Create admin user in database
 * Dieses Script wird nur einmal manuell ausgeführt - This script is run manually only once
 */
async function createAdminUser() {
  console.log(
    "🔐 Admin-Benutzer-Setup wird gestartet... - Starting admin user setup..."
  );

  try {
    // Connect to Mongo
    await connectToMongo();

    // Upsert admin user: ensure ADMIN_PASSWORD_HASH from .env is written
    console.log("👤 Admin-Benutzer wird erstellt/aktualisiert... - Creating/updating admin user...");
    // Prefer raw value from .env file to avoid any environment/expansion issues
    let rawEnvHash = "";
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const parsed = dotenv.parse(fs.readFileSync(envPath));
        rawEnvHash = parsed["ADMIN_PASSWORD_HASH"] || "";
      }
    } catch (err) {
      // ignore and fall back to ADMIN_CREDENTIALS
    }

    const passwordHash = rawEnvHash || ADMIN_CREDENTIALS.passwordHash || (await hashPassword("changeme"));

    const adminUser = await AdminModel.findOneAndUpdate(
      { email: ADMIN_CREDENTIALS.email },
      { email: ADMIN_CREDENTIALS.email, name: "Admin", password: passwordHash, active: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    console.log(
      "✅ Admin-Benutzer erfolgreich erstellt! - Admin user created successfully!"
    );
    console.log(`   E-Mail: ${adminUser.email}`);
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Erstellt am: ${adminUser.createdAt}`);
    console.log("");
    console.log("🔑 Login-Daten für Admin-Panel:");
    console.log(`   E-Mail: ${ADMIN_CREDENTIALS.email}`);
    console.log("   Passwort: [SICHER GEHASHED - SECURELY HASHED]");
    console.log("");
    console.log(
      "⚠️  Das Passwort ist sicher gehashed und wird nicht angezeigt!"
    );
    console.log("   The password is securely hashed and not displayed!");
  } catch (error) {
    console.error(
      "❌ Fehler beim Erstellen des Admin-Benutzers - Error creating admin user:"
    );
    console.error(error);
  } finally {
    // Mongoose bağlantısını kapat - Close mongoose connection
    await (await connectToMongo()).close();
  }
}

/**
 * Admin-Benutzer löschen (für Entwicklung) - Delete admin user (for development)
 */
async function deleteAdminUser() {
  console.log("🗑️  Admin-Benutzer wird gelöscht... - Deleting admin user...");

  try {
    await connectToMongo();
    const deletedUser = await AdminModel.findOneAndDelete({ email: ADMIN_CREDENTIALS.email }).exec();

    if (deletedUser) {
      console.log(
        "✅ Admin-Benutzer erfolgreich gelöscht! - Admin user deleted successfully!"
      );
      console.log(`   E-Mail: ${deletedUser.email}`);
    } else {
      console.log("⚠️  Admin user not found to delete");
    }
  } catch (error) {
    console.error("❌ Fehler beim Löschen - Error deleting:");
    console.error(error);
  } finally {
    await (await connectToMongo()).close();
  }
}

// Script-Argumente verarbeiten - Process script arguments
const action = process.argv[2];

if (action === "create") {
  createAdminUser();
} else if (action === "delete") {
  deleteAdminUser();
} else {
  console.log("📋 Verwendung - Usage:");
  console.log(
    "   bun run scripts/setup-admin.ts create  # Admin erstellen - Create admin"
  );
  console.log(
    "   bun run scripts/setup-admin.ts delete  # Admin löschen - Delete admin"
  );
}
