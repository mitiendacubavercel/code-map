import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Configuración específica para el servidor
      config.externals = config.externals || []
      config.externals.push('@prisma/client')
    }
    return config
  },
  // Configuración específica para Vercel
  output: 'standalone',
}

export default nextConfig
