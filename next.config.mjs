/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/arquifreelas-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/arquifreelas-app/' : '',
};

export default nextConfig;
