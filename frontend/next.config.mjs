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
      // Puedes agregar más patrones de imagen remota aquí si es necesario
    ],
  },
  // Si no necesitas reescribir rutas, puedes eliminar esta sección
  // async rewrites() {
  //   return [
  //     {
  //       source: '/uploads/:path*',
  //       destination: '/api/uploads/:path*',
  //     },
  //   ];
  // },
};
