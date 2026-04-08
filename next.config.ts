import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname : "images.unsplash.com"
      }
    ],
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
