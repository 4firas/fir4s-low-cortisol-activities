/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  env: {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
  },
  optimizeFonts: false,
  webpack(config) {
    // The installed @react-three/a11y package has a broken/missing dist file.
    // Alias it to our local shim so webpack never tries to load the broken package.
    config.resolve.alias['@react-three/a11y'] = path.resolve(__dirname, 'src/a11yShim.tsx');
    return config;
  },
  async redirects() {
    return [
      {
        source: '/check-in',
        destination: process.env.CHECKIN_REDIRECT,
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/old-site',
        destination: '/old-site/index.html',
      },
      {
        source: '/old-site/',
        destination: '/old-site/index.html',
      },
    ];
  },
};

module.exports = nextConfig;
