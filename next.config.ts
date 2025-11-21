import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/smartlink' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/smartlink/' : '',
  trailingSlash: true, // Fix GitHub Pages routing
};

export default nextConfig;
