import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the Turbopack/webpack mismatch warning — no custom config needed
  // Monaco Editor fonts are handled at runtime via CDN by @monaco-editor/react
  turbopack: {},
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
