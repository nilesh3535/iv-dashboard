import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: [
     'lh3.googleusercontent.com', // Google profile images
      'platform-lookaside.fbsbx.com', // Facebook profile images
      'pbs.twimg.com', // Twitter profile images
      'graph.facebook.com', // Facebook profile pictures
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
