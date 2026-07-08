import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/download-report": ["./pdfs/**"],
  },
};

export default nextConfig;
