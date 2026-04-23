import { buildSecurityHeaders } from "./lib/security/headers.mjs";

const STATIC_FILE_PATTERN =
  "/:path*{.svg,.png,.jpg,.jpeg,.webp,.avif,.ico,.woff,.woff2,.css,.js,.txt}";

// CSP wird per-Request vom Proxy (proxy.ts) gesetzt (Nonce-basiert).
// Hier nur Asset-Header (Caching) + Fallback-Security-Header fuer statische
// Responses, die den Proxy nicht durchlaufen.
const fallbackSecurityHeaders = buildSecurityHeaders().filter(
  (h) => h.key !== "Content-Security-Policy",
);

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module":
        "./lib/next-empty-polyfill-module.js",
    },
  },
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: fallbackSecurityHeaders,
      },
      {
        source: STATIC_FILE_PATTERN,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
