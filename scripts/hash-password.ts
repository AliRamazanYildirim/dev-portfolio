import { hashPassword } from "../lib/auth";

/**
 * Passwort-Hash erstellen - Create password hash
 * Dieses Script erstellt einen sicheren Hash für das Admin-Passwort
 * This script creates a secure hash for the admin password
 */
async function createPasswordHash() {
  const password = process.argv[2];

  if (!password) {
    console.log(
      "❌ Bitte geben Sie ein Passwort als Argument an - Please provide a password as argument"
    );
    console.log(
      '   Beispiel - Example: bun run scripts/hash-password.ts "MeinSicheresPasswort"'
    );
    return;
  }

  console.log("🔒 Passwort wird gehashed... - Hashing password...");

  try {
    const hashedPassword = await hashPassword(password);

    console.log(
      "✅ Passwort erfolgreich gehashed! - Password successfully hashed!"
    );
    console.log("");
    console.log("📋 Kopieren Sie diesen Hash in Ihre .env Datei:");
    console.log("   Copy this hash to your .env file:");
    console.log("");
    console.log(`ADMIN_PASSWORD_HASH=${hashedPassword}`);
    console.log("");
    console.log(
      "⚠️  WICHTIG: Setzen Sie diesen Wert als ADMIN_PASSWORD_HASH in Ihrer .env."
    );
    console.log(
      "   IMPORTANT: Set this value as ADMIN_PASSWORD_HASH in your .env file."
    );
    console.log("");
    console.log("🔐 Das Original-Passwort wird nirgendwo gespeichert.");
    console.log("   The original password is not stored anywhere.");
  } catch (error) {
    console.error("❌ Fehler beim Hashen:", error);
  }
}

createPasswordHash();
