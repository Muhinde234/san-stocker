import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // All /proxy/* requests are forwarded server-side to the backend.
        // The browser only ever talks to the same origin → no CORS.
        source:      "/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
