export default {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blogchain.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
};
