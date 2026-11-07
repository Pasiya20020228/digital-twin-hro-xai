/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  outputFileTracingIncludes: {
    '/**': ['./prisma/dev.db', './prisma/schema.prisma'],
  },
};

export default nextConfig;
