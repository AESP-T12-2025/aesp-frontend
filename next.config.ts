import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Commenting out to avoid potential build issues if not needed yet
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aesp-backend.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  async rewrites() {
    // Only proxy in development mode
    // In production (Vercel), use NEXT_PUBLIC_API_URL env variable
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:8000/:path*', // Proxy to Local Backend
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
