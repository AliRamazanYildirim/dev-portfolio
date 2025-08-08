import { db } from "../lib/db";
import { hashPassword, ADMIN_CREDENTIALS } from "../lib/auth";

/**
 * Admin-Benutzer in der Datenbank erstellen - Create admin user in database
 * Dieses Script wird nur einmal manuell ausgeführt - This script is run manually only once
 */
async function createAdminUser() {
  console.log(
    "🔐 Admin-Benutzer-Setup wird gestartet... - Starting admin user setup..."
  );

  try {
    // Prüfen ob bereits ein Admin existiert - Check if admin already exists
    const existingAdmin = await db.adminUser.findUnique({
      where: {
        email: ADMIN_CREDENTIALS.email,
      },
    });

    if (existingAdmin) {
      console.log(
        `❌ Admin-Benutzer mit E-Mail ${ADMIN_CREDENTIALS.email} existiert bereits!`
      );
      console.log("   Admin user with email already exists!");
      return;
    }

    // Admin-Benutzer erstellen - Create admin user
    console.log("👤 Admin-Benutzer wird erstellt... - Creating admin user...");
    const adminUser = await db.adminUser.create({
      data: {
        email: ADMIN_CREDENTIALS.email,
        name: "Admin",
        password: ADMIN_CREDENTIALS.passwordHash, // Bereits gehashtes Passwort - Already hashed password
        active: true,
      },
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
    // Datenbankverbindung schließen - Close database connection
    await db.$disconnect();
  }
}

/**
 * Admin-Benutzer löschen (für Entwicklung) - Delete admin user (for development)
 */
async function deleteAdminUser() {
  console.log("🗑️  Admin-Benutzer wird gelöscht... - Deleting admin user...");

  try {
    const deletedUser = await db.adminUser.delete({
      where: {
        email: ADMIN_CREDENTIALS.email,
      },
    });

    console.log(
      "✅ Admin-Benutzer erfolgreich gelöscht! - Admin user deleted successfully!"
    );
    console.log(`   E-Mail: ${deletedUser.email}`);
  } catch (error) {
    console.error("❌ Fehler beim Löschen - Error deleting:");
    console.error(error);
  } finally {
    await db.$disconnect();
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
