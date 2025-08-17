import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [new URL('https://raw.githubusercontent.com/PokeAPI/**')],
    unoptimized: true
  },
  basePath: '/pokemon', // ✅ your repo name
  assetPrefix: '/pokemon/'
}

export default nextConfig
