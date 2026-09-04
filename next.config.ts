import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Next 16 only permits qualities listed here, and defaults to [75].
    // The engagement photos are the centrepiece of the site, so they are
    // served at 90 — 75 left visible softness on the large hero crop.
    qualities: [75, 90],
  },
  async headers() {
    // Next.js marks these fully-static pages cacheable for a year, which is meant
    // for platforms (like Vercel) that purge that cache on every deploy. Firebase
    // Hosting's CDN doesn't know to do that, so redeploys were invisible to anyone
    // hitting an edge node that had already cached the old response. Forcing
    // revalidation on the document routes fixes that without touching the (safe,
    // content-hashed) long-term caching on /_next/static/*.
    const documentRoutes = ["/", "/gallery", "/story", "/wishes"];
    return documentRoutes.map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }],
    }));
  },
};

export default nextConfig;
