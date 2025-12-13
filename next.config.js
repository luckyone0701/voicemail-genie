/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {}, // MUST be an object
  },

  // Force Webpack (disable Turbopack for now)
  webpack: (config) => {
    return config;
  },

  // Silence Turbopack warning
  turbopack: {},
};

module.exports = nextConfig;
