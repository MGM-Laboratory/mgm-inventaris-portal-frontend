import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The image build sets BUILD_ID to the commit, so two builds of one commit give the same build id. Without it Next.js makes a
  // random id on every build.
  generateBuildId: async () => process.env.BUILD_ID || null,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // In development this proxy gives the page and the API one origin, as nginx does in production. DEV_API_URL defaults to port 8080.
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    return [{ source: "/api/:path*", destination: `${process.env.DEV_API_URL ?? "http://localhost:8080"}/api/:path*` }];
  },
  async headers() {
    // Only the production build sends them. The dev server runs over plain HTTP, where HSTS does nothing.
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // One year, and no includeSubDomains, because other hosts of the lab may not all serve HTTPS
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          // The portal is never meant to sit in a frame of another site
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
