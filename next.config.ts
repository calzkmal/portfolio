import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // These pages live on the home page now; old links land on the matching section.
  async redirects() {
    return [
      { source: "/experience", destination: "/#experience", permanent: true },
      { source: "/education", destination: "/#education", permanent: true },
      { source: "/achievements", destination: "/#recognition", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Add remote hosts here if you ever load images from a CDN, e.g.
    // remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
  },
};

export default nextConfig;
