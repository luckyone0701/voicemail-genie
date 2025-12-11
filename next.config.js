/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enables server actions and edge functions for App Router
  experimental: {
    serverActions: true,
  },

  // Allow static assets from public/ correctly
  images: {
    unoptimized: true, // Disable Image Optimization for Vercel-Free-friendly deploys
  },

  // Improve build stability on Windows (CRLF issues)
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;
