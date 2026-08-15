import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/propmak",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
