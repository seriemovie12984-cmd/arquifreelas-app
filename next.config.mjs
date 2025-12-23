/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR habilitado para Railway (necesario para auth y APIs)
  // Force rebuild: 2025-12-23-v2
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
