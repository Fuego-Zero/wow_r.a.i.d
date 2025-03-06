import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.NODE_ENV === "production" ? "export" : undefined,

  // 开发环境下的API反向代理配置
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    return [
      {
        source: "/api/:path*", // 只匹配API路径
        destination: "http://127.0.0.1:7000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
