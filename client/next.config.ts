import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS hostnames for now
      },
      {
        protocol: "http",
        hostname: "**", // Allow all HTTP hostnames for development
      },
    ],
  },
};

export default nextConfig;
