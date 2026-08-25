import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mongoose and bcryptjs need to run in Node.js runtime (not Edge)
  serverExternalPackages: ["mongoose", "bcryptjs"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Enable proper async params in Next.js 15
  experimental: {},
};

export default nextConfig;
