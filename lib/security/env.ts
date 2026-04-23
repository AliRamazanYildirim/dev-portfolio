/**
 * Server-Env Validierung zum Startup.
 *
 * Pure Funktion ohne externe Abhaengigkeit (SRP). Wird ueber
 * `instrumentation.ts` beim Boot aufgerufen und wirft, wenn ein
 * erforderliches Geheimnis fehlt.
 */

export const REQUIRED_SERVER_ENV_VARS = [
    "JWT_SECRET",
    "MONGODB_URI",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD_HASH",
] as const;

export type RequiredServerEnvVar = (typeof REQUIRED_SERVER_ENV_VARS)[number];

export interface EnvValidationResult {
    missing: RequiredServerEnvVar[];
    valid: boolean;
}

export function validateServerEnv(
    env: NodeJS.ProcessEnv = process.env,
): EnvValidationResult {
    const missing = REQUIRED_SERVER_ENV_VARS.filter((key) => {
        const value = env[key];
        return typeof value !== "string" || value.trim() === "";
    });

    return { missing, valid: missing.length === 0 };
}

/**
 * Wirft einen Error wenn required env vars fehlen.
 * Bricht damit den App-Start ab, bevor unsichere Defaults greifen.
 */
export function assertServerEnv(env: NodeJS.ProcessEnv = process.env): void {
    const { valid, missing } = validateServerEnv(env);
    if (!valid) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`,
        );
    }
}
