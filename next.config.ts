import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit — too small for a
      // phone photo/video upload, so check-in and protocol proofs fail.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
