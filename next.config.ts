/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Eta dile prithibir shob https site allow hobe
      },
      {
        protocol: 'http',
        hostname: '**', // Eta dile shob http site allow hobe
      },
    ],
  },
}

module.exports = nextConfig