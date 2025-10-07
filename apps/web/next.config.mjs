import createMDX from '@next/mdx';
const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['farmhash-modern']
  },
  reactStrictMode: true,
  pageExtensions: ['ts','tsx','mdx'],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Redirect old URLs to new structure
  async redirects() {
    return [
      {
        source: '/pages/home',
        destination: '/',
        permanent: true, // 301 redirect for SEO
      },
      // Add other common old URL patterns if needed
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    // Handle WebAssembly modules
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle WASM files properly
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Don't parse farmhash-modern WASM files
    config.module.noParse = /farmhash.*\.wasm$/;

    return config;
  },
};
export default withMDX(nextConfig);
