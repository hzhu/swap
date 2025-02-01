import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["raw.githubusercontent.com", "token-registry.s3.amazonaws.com"],
  },
};

export default nextConfig;
