/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  output: 'export',
  basePath: '/mli-select',
  assetPrefix: '/mli-select',
  trailingSlash: true,
  images: { unoptimized: true }
};
export default nextConfig;
