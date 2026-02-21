/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // বিল্ড করার সময় ESLint এরর ইগনোর করবে
    ignoreDuringBuilds: true,
  },
  typescript: {
    // টাইপ এরর থাকলেও বিল্ড হতে দিবে
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig