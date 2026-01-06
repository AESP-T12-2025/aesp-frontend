import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Commenting out to avoid potential build issues if not needed yet
  images: {
    domains: ['aesp-backend.onrender.com'], // Allow images from backend
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://aesp-backend.onrender.com/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
