import type { NextConfig } from "next";

// Merged from next.config.ts + next.config.mjs. Delete next.config.mjs after adding this file.
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Kept from the old .mjs file. Consider removing once `npm run build` passes without it.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Near-duplicate service pages -> point to the main page so they don't compete in Google.
  async redirects() {
    return [
      { source: "/services/commercial-access-security", destination: "/services/security-guard", permanent: true },
      { source: "/services/vip-bouncers-event-marshals", destination: "/services/bouncers", permanent: true },
      { source: "/services/corporate-office-housekeeping", destination: "/services/housekeeping", permanent: true },
      { source: "/services/industrial-shopfloor-corridor-care", destination: "/services/housekeeping", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        // Keep *.vercel.app preview domains out of Google
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
