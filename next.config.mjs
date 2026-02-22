/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      '../build/polyfills/polyfill-module': './lib/next-empty-polyfill-module.js',
    },
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
