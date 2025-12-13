/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },

  // Silence Turbopack vs webpack conflict
  turbopack: {},

  // REMOVE any custom webpack config unless absolutely required
};

module.exports = nextConfig;
