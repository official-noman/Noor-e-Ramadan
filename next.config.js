/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Custom server will handle the port
  output: 'standalone', // For better production builds

  // ডেভেলপমেন্ট এবং বিল্ড টাইম কমানোর জন্য এই অংশটি যোগ করা হয়েছে
  experimental: {
    // lucide-react বা এই জাতীয় লাইব্রেরিগুলোর সব আইকন একসাথে লোড না করে 
    // শুধুমাত্র প্রয়োজনীয় আইকনগুলো কম্পাইল করবে।
    optimizePackageImports: ['lucide-react'],
  },

  // যদি আপনার কোনো ইমেজ এক্সটারনাল সোর্স থেকে আসে, এখানে ডোমেইন অ্যাড করতে পারেন
  images: {
    remotePatterns: [],
  },
}

module.exports = nextConfig