/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // বিল্ড করার সময় ESLint এরর ইগনোর করবে
    ignoreDuringBuilds: true,
  },
  typescript: {
    // টাইপ এরর থাকলেও বিল্ড হতে দিবে
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
}

module.exports = nextConfig