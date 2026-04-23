/**
 * Next.js Instrumentation — laeuft einmalig beim Server-Boot.
 * Wir validieren hier die Pflicht-Env-Variablen fuer den Node-Runtime.
 */

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { assertServerEnv } = await import("./lib/security/env");
        assertServerEnv();
    }
}
