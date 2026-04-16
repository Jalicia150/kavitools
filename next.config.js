/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: { browser: './empty-module.js' },
    },
  },
  serverExternalPackages: ['@react-pdf/renderer'],
};
module.exports = nextConfig;
