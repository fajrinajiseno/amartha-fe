import type { NextConfig } from 'next'

const repoName = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [new URL('https://raw.githubusercontent.com/PokeAPI/**')],
    unoptimized: true
  },
  basePath: repoName ? `/${repoName}` : '',
  assetPrefix: repoName ? `/${repoName}/` : ''
}

export default nextConfig
