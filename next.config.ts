import { WebpackConfigContext } from 'next/dist/server/config-shared';
import { NextConfig } from 'next/types';
import { Configuration as WebpackConfig } from 'webpack';

import packageJson from './package.json';

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['plugged.in'],
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [];
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
    incomingRequests: {
      ignore: [/\api\/v1\/health/],
    },
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['plugged.in'],
    },
    staleTimes: {
      dynamic: 30,  // 30 seconds for dynamic content
      static: 180,  // 3 minutes for static content
    },
  },
  // Fix for dynamic server usage error
  staticPageGenerationTimeout: 120, // Increase timeout for static page generation
  
  webpack: (config: WebpackConfig, { isServer }: WebpackConfigContext) => {
    // Force Next.js to use the native Node.js fetch
    if (!isServer) {
      config.devtool = 'source-map';
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}),
          fs: false,
          net: false,
          tls: false,
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
