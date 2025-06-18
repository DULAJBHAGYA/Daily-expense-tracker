import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // port: '', // Only include if you need to specify a port
        pathname: '/**', // This allows all paths under the domain
      },
      // Add more patterns as needed for other image sources
    ],
  },
  // ... other configurations
}

export default nextConfig