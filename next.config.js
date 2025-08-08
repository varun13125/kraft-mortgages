// This file exists to satisfy Vercel's Next.js detection  
// The actual config is in apps/web/next.config.mjs
// Updated for deployment
module.exports = {
  experimental: { typedRoutes: true },
  reactStrictMode: true,
  pageExtensions: ['ts','tsx','mdx']
};