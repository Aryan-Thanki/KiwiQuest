import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep module discovery inside this app when parent folders contain lockfiles.
    root: process.cwd(),
  },
};

export default nextConfig;
