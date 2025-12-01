import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow remote images used by Card/Listings
    domains: ["example.com"],
    // Alternatively, use remotePatterns for more control:
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "example.com",
    //   },
    // ],
  },
};

export default nextConfig;
