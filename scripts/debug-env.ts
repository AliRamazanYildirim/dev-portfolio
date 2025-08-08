import { ADMIN_CREDENTIALS } from "../lib/auth";

console.log("Environment Debug:");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN_PASSWORD_HASH (raw):", process.env.ADMIN_PASSWORD_HASH);
console.log("ADMIN_CREDENTIALS.email:", ADMIN_CREDENTIALS.email);
console.log("ADMIN_CREDENTIALS.passwordHash:", ADMIN_CREDENTIALS.passwordHash);
