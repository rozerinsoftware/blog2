import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "perspektifyazilim.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "www.perspektifyazilim.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "codewithmosh.com" },
      { protocol: "https", hostname: "www.codewithmosh.com" },
      { protocol: "https", hostname: "uploads.teachablecdn.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "gstatic.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
