/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  serverRuntimeConfig: true,
  server: {
    port: 13000,
  },
};

module.exports = nextConfig;
