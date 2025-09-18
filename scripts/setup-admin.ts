import { connectToMongo } from "../lib/mongodb";
import AdminModel from "../models/Admin";
import { hashPassword, ADMIN_CREDENTIALS } from "../lib/auth";

// Ensure any escaped env hash is cleaned (in case hosting UI injects escaped dollars or quotes)
function cleanAdminPasswordHash(raw?: string): string {
  if (!raw) return "";
  let s = String(raw).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  s = s.replace(/\\\$/g, "$");
  return s;
}

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

    // Prüfen ob bereits ein Admin existiert - Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ email: ADMIN_CREDENTIALS.email }).exec();

    if (existingAdmin) {
      console.log(
        `❌ Admin-Benutzer mit E-Mail ${ADMIN_CREDENTIALS.email} existiert bereits!`
      );
      console.log("   Admin user with email already exists!");
      return;
    }

    // Admin-Benutzer erstellen - Create admin user
    console.log("👤 Admin-Benutzer wird erstellt... - Creating admin user...");
    const rawHash = ADMIN_CREDENTIALS.passwordHash;
    const cleaned = cleanAdminPasswordHash(rawHash);
    const passwordHash = cleaned || (await hashPassword("changeme"));

    const adminUser = await AdminModel.create({
      email: ADMIN_CREDENTIALS.email,
      name: "Admin",
      password: passwordHash,
      active: true,
    });

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
