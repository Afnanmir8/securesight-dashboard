import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  output: 'standalone',

  // ✅ Replaced deprecated key
  serverExternalPackages: ['@prisma/client'],

  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },

  // ⚠️ Removed Webpack config — only if you're committed to Turbopack.
  // If you need custom Webpack logic, keep it — but note Turbopack ignores it.
};

export default nextConfig;
