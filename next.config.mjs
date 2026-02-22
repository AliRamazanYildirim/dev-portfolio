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
};

export default nextConfig;
