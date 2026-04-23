/**
 * Security Response Headers
 *
 * Zentrale Definition der globalen HTTP-Security-Header.
 * Als .mjs, damit next.config.mjs sie ohne TS-Transpile importieren kann.
 *
 * @typedef {{ key: string; value: string }} SecurityHeader
 */

const CLOUDINARY_HOST = "https://res.cloudinary.com";
const TURNSTILE_HOST = "https://challenges.cloudflare.com";

/**
 * Content Security Policy.
 * Ohne Nonce (z.B. für statische Assets) fällt script-src auf 'unsafe-inline' zurück,
 * damit Next.js Framework-Scripts funktionieren. HTML-Seiten erhalten per Proxy
 * einen Nonce und die strikte Variante mit 'strict-dynamic'.
 *
 * @param {{ isDev: boolean; nonce?: string }} options
 * @returns {string}
 */
function buildContentSecurityPolicy({ isDev, nonce }) {
  const scriptSrc = nonce
    ? [
        "'self'",
        `'nonce-${nonce}'`,
        "'strict-dynamic'",
        isDev ? "'unsafe-eval'" : "",
        TURNSTILE_HOST,
      ]
    : [
        "'self'",
        "'unsafe-inline'",
        isDev ? "'unsafe-eval'" : "",
        TURNSTILE_HOST,
      ];

  const directives = {
    "default-src": "'self'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
    "object-src": "'none'",
    "script-src": scriptSrc.filter(Boolean).join(" "),
    "style-src": "'self' 'unsafe-inline'",
    "img-src": `'self' data: blob: ${CLOUDINARY_HOST}`,
    "font-src": "'self' data:",
    "connect-src": `'self' ${TURNSTILE_HOST}`,
    "frame-src": TURNSTILE_HOST,
    "worker-src": "'self' blob:",
    "manifest-src": "'self'",
    "upgrade-insecure-requests": "",
  };

  return Object.entries(directives)
    .map(([directive, value]) => (value ? `${directive} ${value}` : directive))
    .join("; ");
}

/**
 * Baut das vollständige Security-Header-Set für alle Routen.
 * @param {NodeJS.ProcessEnv} [env]
 * @param {{ nonce?: string }} [options]
 * @returns {SecurityHeader[]}
 */
export function buildSecurityHeaders(env = process.env, options = {}) {
  const isDev = env.NODE_ENV !== "production";

  return [
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy({ isDev, nonce: options.nonce }),
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
  ];
}
