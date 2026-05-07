import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [75, 85, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        port: "",
        pathname: "/**",
      },
    ],
  },

};

export default nextConfig;
