import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静的エクスポートを一時的に無効化してVercelでの動作を確認
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
