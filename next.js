/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // If you use next/image with external images, list safe domains:
  images: {
    domains: ["images.unsplash.com", "cdn.example.com"],
  },
  // If you have experimental appDir, make sure it's set correctly:
  experimental: {
    appDir: true
  },
  // Set environment variables that should be exposed to client:
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }
};

module.exports = nextConfig;

