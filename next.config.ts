import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prisma client must not be bundled — it uses native binaries at runtime
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
