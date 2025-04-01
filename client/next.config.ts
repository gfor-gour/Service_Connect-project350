import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary CDN hostname
        pathname: "/do0bjug3q/**", // Cloudinary path (your cloud name + any path after)
      },
    ],
  },
};

export default nextConfig;
