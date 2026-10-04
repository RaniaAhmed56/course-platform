import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // serve modern formats; AVIF first
    formats: ["image/avif", "image/webp"],
    // Course covers are local, self-authored SVGs — safe to serve via next/image.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
