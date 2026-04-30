import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    const target = process.env.UPTIME_KUMA_URL?.replace(/\/+$/, "");
    if (!target) return [];
    return [
      {
        source: "/api/status-page/:path*",
        destination: `${target}/api/status-page/:path*`,
      },
    ];
  },
};

export default nextConfig;
