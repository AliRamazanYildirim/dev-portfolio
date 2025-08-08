import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JWT Secret - Umgebungsvariable aus .env.local - Environment variable from .env.local
const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-key-change-in-production";

// Admin-Anmeldedaten - Admin credentials
export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
  // Gehashtes Passwort aus Umgebungsvariable - Hashed password from environment variable
  passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
};

// Interface für Admin-Benutzer - Interface for admin user
export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

// JWT-Token-Daten - JWT token payload
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Passwort hashen - Hash password
 * @param password - Klartext-Passwort - Plain text password
 * @returns Gehashtes Passwort - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Hohe Sicherheit - High security
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Passwort verifizieren - Verify password
 * @param password - Klartext-Passwort - Plain text password
 * @param hashedPassword - Gehashtes Passwort aus Datenbank - Hashed password from database
 * @returns Wahr wenn Passwort korrekt - True if password is correct
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * JWT-Token erstellen - Create JWT token
 * @param user - Admin-Benutzer-Daten - Admin user data
 * @returns JWT-Token-String - JWT token string
 */
export function createToken(user: AdminUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
  };

  // Token gültig für 24 Stunden - Token valid for 24 hours
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h",
    issuer: "portfolio-admin",
  });
}

/**
 * JWT-Token verifizieren - Verify JWT token
 * @param token - JWT-Token-String - JWT token string
 * @returns Entschlüsselte Token-Daten oder null - Decoded token data or null
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    // Token ungültig, abgelaufen oder manipuliert - Token invalid, expired or tampered
    return null;
  }
}

/**
 * Auth-Cookie-Namen - Auth cookie names
 */
export const AUTH_COOKIE_NAME = "admin-auth-token";

/**
 * Cookie-Optionen für Sicherheit - Cookie options for security
 */
export const COOKIE_OPTIONS = {
  httpOnly: true, // Schutz vor XSS - Protection against XSS
  secure: process.env.NODE_ENV === "production", // HTTPS in Produktion - HTTPS in production
  sameSite: "strict" as const, // CSRF-Schutz - CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 24 Stunden in Millisekunden - 24 hours in milliseconds
  path: "/",
};
