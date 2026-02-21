/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Custom server will handle the port
  output: 'standalone', // For better production builds
}

module.exports = nextConfig
