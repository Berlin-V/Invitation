import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      // Temporary placeholder images — swap for real photos when available
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
