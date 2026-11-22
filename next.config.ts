import type { NextConfig } from "next";
import withBundleAnalyzerInit from "@next/bundle-analyzer";
import { BASE_PATH } from "./app/base-path";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
};

/** `pnpm analyze` opens an interactive treemap of what's actually inside each chunk. */
const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
