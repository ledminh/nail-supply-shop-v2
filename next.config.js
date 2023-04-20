/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/seed/picsum/**/**",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "/**/**",
      },
    ],
  },
};

module.exports = nextConfig;
