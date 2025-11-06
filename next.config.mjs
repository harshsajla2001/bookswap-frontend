/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bookswap-mu.vercel.app",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
