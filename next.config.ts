import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [new URL('https://raw.githubusercontent.com/PokeAPI/**')]
  }
}

export default nextConfig
