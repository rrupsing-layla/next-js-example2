/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Enable dynamic routes to be handled at runtime
  trailingSlash: true,
  dynamicParams: true,
};

module.exports = nextConfig;
