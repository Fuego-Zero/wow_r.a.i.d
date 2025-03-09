import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: process.env.NODE_ENV === "production" ? "export" : undefined,
};

if (process.env.NODE_ENV === "development") {
  nextConfig.rewrites = async () => {
    return [
      {
        source: "/api/:path*", // 只匹配API路径
        destination: "http://127.0.0.1:7000/api/:path*",
      },
    ];
  };
}

export default nextConfig;
