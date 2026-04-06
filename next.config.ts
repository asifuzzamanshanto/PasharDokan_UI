import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: 'https://pashardokan-api.onrender.com',
  },
};

export default nextConfig;