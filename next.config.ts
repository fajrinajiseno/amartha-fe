import type { NextConfig } from 'next'

const repoName = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig: NextConfig = {
  basePath: repoName ? `/${repoName}` : '',
  assetPrefix: repoName ? `/${repoName}/` : ''
}

export default nextConfig
