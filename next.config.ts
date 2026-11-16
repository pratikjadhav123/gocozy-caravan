import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence Next.js 16 Turbopack default warning when no turbopack options needed
  turbopack: {},
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Keep client from aggressively re-fetching dynamic pages in the background
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
