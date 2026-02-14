import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@radix-ui/react-select", "@radix-ui/react-popover", "@radix-ui/react-tooltip"],
  },
};

export default nextConfig;
