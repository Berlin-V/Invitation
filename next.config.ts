import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Temporary placeholder images — swap for real photos when available
      { protocol: "https", hostname: "picsum.photos" },
      // Google profile photos used on the Wishes wall
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
