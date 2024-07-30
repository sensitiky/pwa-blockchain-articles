import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadsDir = join(process.cwd(), 'uploads');

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir);
}

export default {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'blogchain.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};