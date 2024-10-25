export default {
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogchain.onrender.com",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};
